import React, { type FC, useCallback } from 'react';

import RequestButton from './RequestButton';
import type { SeerrMedia } from '../types';

interface SeerrMediaCardProps {
    media: SeerrMedia;
    isSubmitting?: boolean;
    onRequest: (media: SeerrMedia) => void;
}

const formatYear = (date?: string) => date?.slice(0, 4);

const SeerrMediaCard: FC<SeerrMediaCardProps> = ({ media, isSubmitting, onRequest }) => {
    const onRequestClick = useCallback(() => {
        onRequest(media);
    }, [ media, onRequest ]);

    return (
        <article className='seerrMediaCard'>
            <div className='seerrMediaCard-poster'>
                {media.posterUrl ? (
                    <img
                        src={media.posterUrl}
                        alt={media.title}
                        loading='lazy'
                    />
                ) : (
                    <span>No artwork</span>
                )}
            </div>
            <div className='seerrMediaCard-content'>
                <h2>{media.title}</h2>
                <p className='seerrMediaCard-meta'>
                    {media.mediaType === 'movie' ? 'Movie' : 'TV'}{formatYear(media.releaseDate) ? ` • ${formatYear(media.releaseDate)}` : ''}
                </p>
                <p className='seerrMediaCard-overview'>
                    {media.overview || 'No description available.'}
                </p>
                <div className='seerrMediaCard-actions'>
                    <RequestButton
                        available={media.available}
                        requestStatus={media.requestStatus}
                        isSubmitting={isSubmitting}
                        onClick={onRequestClick}
                    />
                </div>
            </div>
        </article>
    );
};

export default SeerrMediaCard;
