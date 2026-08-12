import React, { type FC, useCallback } from 'react';

import type { SeerrSeason } from '../types';

interface SeerrSeasonRowProps {
    season: SeerrSeason;
    expanded: boolean;
    confirming: boolean;
    submitting: boolean;
    onToggle: (seasonNumber: number) => void;
    onStartConfirmation: (seasonNumber: number) => void;
    onCancelConfirmation: () => void;
    onRequest: (season: SeerrSeason) => void;
}

interface SeasonRequestActionProps {
    season: SeerrSeason;
    canRequest: boolean;
    confirming: boolean;
    submitting: boolean;
    onStartConfirmation: () => void;
    onCancelConfirmation: () => void;
    onRequest: () => void;
}

const getStatus = (season: SeerrSeason) => {
    if (season.available) return 'Available';
    if (season.requestStatus === 1) return 'Requested';
    if (season.requestStatus === 2) return 'Approved';
    if (season.partiallyAvailable) return 'Partially available';
    return 'Not requested';
};

const SeasonRequestAction: FC<SeasonRequestActionProps> = ({
    season,
    canRequest,
    confirming,
    submitting,
    onStartConfirmation,
    onCancelConfirmation,
    onRequest
}) => {
    if (!canRequest) return null;
    if (!confirming) {
        return (
            <button
                type='button'
                className='seerrRequestButton'
                onClick={onStartConfirmation}
            >
                {season.partiallyAvailable ? 'Request remaining episodes' : `Request ${season.name}`}
            </button>
        );
    }

    return (
        <div className='seerrSeason-confirm' role='group' aria-label={`Confirm ${season.name} request`}>
            <strong>Request only {season.name}?</strong>
            <div>
                <button
                    type='button'
                    className='seerrRequestButton'
                    onClick={onRequest}
                    disabled={submitting}
                >
                    {submitting ? 'Requesting...' : 'Confirm request'}
                </button>
                <button
                    type='button'
                    className='seerrSecondaryButton'
                    onClick={onCancelConfirmation}
                    disabled={submitting}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

const SeerrSeasonRow: FC<SeerrSeasonRowProps> = ({
    season,
    expanded,
    confirming,
    submitting,
    onToggle,
    onStartConfirmation,
    onCancelConfirmation,
    onRequest
}) => {
    const toggle = useCallback(() => {
        onToggle(season.seasonNumber);
    }, [ onToggle, season.seasonNumber ]);
    const startConfirmation = useCallback(() => {
        onStartConfirmation(season.seasonNumber);
    }, [ onStartConfirmation, season.seasonNumber ]);
    const request = useCallback(() => {
        onRequest(season);
    }, [ onRequest, season ]);
    const alreadyRequested = season.requestStatus === 1 || season.requestStatus === 2;
    const canRequest = !season.available && !alreadyRequested;
    const status = getStatus(season);
    const episodeLabel = `${season.episodeCount} episode${season.episodeCount === 1 ? '' : 's'}`;

    return (
        <article className='seerrSeason'>
            <button
                type='button'
                className='seerrSeason-summary'
                onClick={toggle}
                aria-expanded={expanded}
                aria-controls={`seerr-season-${season.seasonNumber}`}
            >
                <span className='seerrSeason-heading'>
                    <strong>{season.name}</strong>
                    <span>{episodeLabel}</span>
                </span>
                <span className={`seerrSeason-status seerrSeason-status-${status.toLowerCase().replace(/ /g, '-')}`}>
                    {status}
                </span>
                <span className='seerrSeason-chevron' aria-hidden='true'>⌄</span>
            </button>
            {expanded ? (
                <div id={`seerr-season-${season.seasonNumber}`} className='seerrSeason-details'>
                    <p>{season.overview || 'No season description is available.'}</p>
                    <SeasonRequestAction
                        season={season}
                        canRequest={canRequest}
                        confirming={confirming}
                        submitting={submitting}
                        onStartConfirmation={startConfirmation}
                        onCancelConfirmation={onCancelConfirmation}
                        onRequest={request}
                    />
                </div>
            ) : null}
        </article>
    );
};

export default SeerrSeasonRow;
