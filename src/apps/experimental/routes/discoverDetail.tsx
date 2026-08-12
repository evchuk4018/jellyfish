import React, { type FC, useCallback, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Page from 'components/Page';

import { useCreateSeerrRequest, useSeerrMediaDetail } from 'apps/experimental/features/seerr/api';
import RequestButton from 'apps/experimental/features/seerr/components/RequestButton';
import SeerrSeasonRow from 'apps/experimental/features/seerr/components/SeerrSeasonRow';
import { getSeerrDiscoverPath } from 'apps/experimental/features/seerr/navigation';
import { createSeerrRequestInput } from 'apps/experimental/features/seerr/requestInput';
import type {
    SeerrMediaDetail,
    SeerrMediaType,
    SeerrSeason
} from 'apps/experimental/features/seerr/types';

import 'apps/experimental/features/seerr/seerr.scss';

interface MediaHeroProps {
    media: SeerrMediaDetail;
    requestPending: boolean;
    onRequestMovie: () => void;
}

interface SeasonListProps {
    seasons: SeerrSeason[];
    expandedSeason?: number;
    confirmingSeason?: number;
    requestingSeason?: number;
    onToggle: (seasonNumber: number) => void;
    onStartConfirmation: (seasonNumber: number) => void;
    onCancelConfirmation: () => void;
    onRequest: (season: SeerrSeason) => void;
}

interface DetailStateProps extends Omit<SeasonListProps, 'seasons'> {
    validRoute: boolean;
    pending: boolean;
    errorMessage?: string;
    media?: SeerrMediaDetail;
    requestPending: boolean;
    requestErrorMessage?: string;
    successMessage?: string;
    onRequestMovie: () => void;
}

const getMediaType = (value?: string): SeerrMediaType | undefined => (
    value === 'movie' || value === 'tv' ? value : undefined
);

const getMediaId = (value?: string) => {
    const mediaId = Number(value);
    return Number.isInteger(mediaId) && mediaId > 0 ? mediaId : undefined;
};

const formatYear = (date?: string) => date?.slice(0, 4);

const MediaHero: FC<MediaHeroProps> = ({ media, requestPending, onRequestMovie }) => {
    const year = formatYear(media.releaseDate);
    const metadata = [
        media.mediaType === 'movie' ? 'Movie' : 'TV',
        year,
        ...media.genres
    ].filter(Boolean).join(' | ');

    return (
        <section className='seerrDetailHero'>
            {media.backdropUrl ? (
                <div
                    className='seerrDetailHero-backdrop'
                    style={{ backgroundImage: `url("${media.backdropUrl}")` }}
                    aria-hidden='true'
                />
            ) : null}
            <div className='seerrDetailHero-shade' aria-hidden='true' />
            <div className='seerrDetailHero-content'>
                <div className='seerrDetailHero-poster'>
                    {media.posterUrl ? <img src={media.posterUrl} alt='' /> : <span>No artwork</span>}
                </div>
                <div className='seerrDetailHero-copy'>
                    <h1>{media.title}{year ? ` (${year})` : ''}</h1>
                    <p className='seerrDetailHero-meta'>{metadata}</p>
                    {media.tagline ? <p className='seerrDetailHero-tagline'>{media.tagline}</p> : null}
                    <h2>Overview</h2>
                    <p className='seerrDetailHero-overview'>
                        {media.overview || 'No description available.'}
                    </p>
                    {media.mediaType === 'movie' ? (
                        <RequestButton
                            available={media.available}
                            requestStatus={media.requestStatus}
                            isSubmitting={requestPending}
                            onClick={onRequestMovie}
                        />
                    ) : null}
                </div>
            </div>
        </section>
    );
};

const SeasonList: FC<SeasonListProps> = ({
    seasons,
    expandedSeason,
    confirmingSeason,
    requestingSeason,
    onToggle,
    onStartConfirmation,
    onCancelConfirmation,
    onRequest
}) => {
    if (!seasons.length) {
        return <div role='status' className='seerrNotice'>No regular seasons were found.</div>;
    }

    return (
        <>
            {seasons.map(season => (
                <SeerrSeasonRow
                    key={season.seasonNumber}
                    season={season}
                    expanded={expandedSeason === season.seasonNumber}
                    confirming={confirmingSeason === season.seasonNumber}
                    submitting={requestingSeason === season.seasonNumber}
                    onToggle={onToggle}
                    onStartConfirmation={onStartConfirmation}
                    onCancelConfirmation={onCancelConfirmation}
                    onRequest={onRequest}
                />
            ))}
        </>
    );
};

const DetailState: FC<DetailStateProps> = ({
    validRoute,
    pending,
    errorMessage,
    media,
    requestPending,
    requestErrorMessage,
    successMessage,
    onRequestMovie,
    ...seasonListProps
}) => {
    if (!validRoute) {
        return <div role='alert' className='seerrNotice seerrNotice-error'>This movie or TV link is invalid.</div>;
    }
    if (pending) {
        return <div role='status' className='seerrNotice seerrNotice-loading'>Loading media details...</div>;
    }
    if (errorMessage) {
        return <div role='alert' className='seerrNotice seerrNotice-error'>{errorMessage}</div>;
    }
    if (!media) return null;

    const seasons = [ ...(media.seasons || []) ]
        .filter(season => season.seasonNumber > 0)
        .sort((left, right) => right.seasonNumber - left.seasonNumber);

    return (
        <>
            <MediaHero
                media={media}
                requestPending={requestPending}
                onRequestMovie={onRequestMovie}
            />
            {successMessage ? (
                <div role='status' className='seerrNotice seerrNotice-success'>{successMessage}</div>
            ) : null}
            {requestErrorMessage ? (
                <div role='alert' className='seerrNotice seerrNotice-error'>{requestErrorMessage}</div>
            ) : null}
            {media.mediaType === 'tv' ? (
                <section className='seerrSeasons' aria-labelledby='seerr-seasons-heading'>
                    <h2 id='seerr-seasons-heading'>Seasons</h2>
                    <SeasonList seasons={seasons} {...seasonListProps} />
                </section>
            ) : null}
        </>
    );
};

const DiscoverDetail = () => {
    const params = useParams();
    const [ searchParams ] = useSearchParams();
    const mediaType = getMediaType(params.mediaType);
    const mediaId = getMediaId(params.mediaId);
    const query = searchParams.get('q') || '';
    const detail = useSeerrMediaDetail(mediaType, mediaId);
    const createRequest = useCreateSeerrRequest();
    const [ expandedSeason, setExpandedSeason ] = useState<number>();
    const [ confirmingSeason, setConfirmingSeason ] = useState<number>();
    const [ requestingSeason, setRequestingSeason ] = useState<number>();
    const [ successMessage, setSuccessMessage ] = useState<string>();

    const toggleSeason = useCallback((seasonNumber: number) => {
        setExpandedSeason(current => current === seasonNumber ? undefined : seasonNumber);
        setConfirmingSeason(undefined);
    }, []);

    const startSeasonConfirmation = useCallback((seasonNumber: number) => {
        setExpandedSeason(seasonNumber);
        setConfirmingSeason(seasonNumber);
        setSuccessMessage(undefined);
    }, []);

    const cancelSeasonConfirmation = useCallback(() => {
        setConfirmingSeason(undefined);
    }, []);

    const requestSeason = useCallback(async (season: SeerrSeason) => {
        if (!detail.data) return;
        setRequestingSeason(season.seasonNumber);
        setSuccessMessage(undefined);
        try {
            await createRequest.mutateAsync(
                createSeerrRequestInput(detail.data, season.seasonNumber)
            );
            setConfirmingSeason(undefined);
            setSuccessMessage(`${season.name} requested.`);
        } catch {
            // The mutation error is rendered below.
        } finally {
            setRequestingSeason(undefined);
        }
    }, [ createRequest, detail.data ]);

    const requestMovie = useCallback(() => {
        const media = detail.data;
        if (!media) return;
        setSuccessMessage(undefined);
        createRequest.mutateAsync(createSeerrRequestInput(media))
            .then(() => setSuccessMessage(`${media.title} requested.`))
            .catch(() => undefined);
    }, [ createRequest, detail.data ]);

    return (
        <Page
            id='discoverDetailPage'
            className='mainAnimatedPage libraryPage noSecondaryNavPage seerrPage'
            title={detail.data?.title || 'Discover'}
        >
            <div className='padded-bottom-page seerrDetailPage-content'>
                <Link className='seerrBackLink' to={getSeerrDiscoverPath(query)}>
                    &larr; Back to results
                </Link>
                <DetailState
                    validRoute={Boolean(mediaType && mediaId)}
                    pending={detail.isPending}
                    errorMessage={detail.isError ? detail.error.message : undefined}
                    media={detail.data}
                    requestPending={createRequest.isPending}
                    requestErrorMessage={createRequest.isError ? createRequest.error.message : undefined}
                    successMessage={successMessage}
                    expandedSeason={expandedSeason}
                    confirmingSeason={confirmingSeason}
                    requestingSeason={requestingSeason}
                    onRequestMovie={requestMovie}
                    onToggle={toggleSeason}
                    onStartConfirmation={startSeasonConfirmation}
                    onCancelConfirmation={cancelSeasonConfirmation}
                    onRequest={requestSeason}
                />
            </div>
        </Page>
    );
};

export default DiscoverDetail;
