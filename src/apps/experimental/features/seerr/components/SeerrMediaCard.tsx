import React, { type FC, useCallback } from 'react';

import type { SeerrMedia } from '../types';

interface SeerrMediaCardProps {
    media: SeerrMedia;
    onSelect: (media: SeerrMedia) => void;
}

const formatYear = (date?: string) => date?.slice(0, 4);

const SeerrMediaCard: FC<SeerrMediaCardProps> = ({ media, onSelect }) => {
    const onSelectClick = useCallback(() => {
        onSelect(media);
    }, [ media, onSelect ]);

    return (
        <article className='seerrMediaCard'>
            <button
                type='button'
                className='seerrMediaCard-select'
                onClick={onSelectClick}
                aria-label={`View details for ${media.title}`}
            >
                <div className='seerrMediaCard-poster'>
                    {media.posterUrl ? (
                        <img
                            src={media.posterUrl}
                            alt=''
                            loading='lazy'
                        />
                    ) : (
                        <span>No artwork</span>
                    )}
                </div>
                <div className='seerrMediaCard-content'>
                    <h2>{media.title}</h2>
                    <p className='seerrMediaCard-meta'>
                        {media.mediaType === 'movie' ? 'Movie' : 'TV'}{formatYear(media.releaseDate) ? ` - ${formatYear(media.releaseDate)}` : ''}
                    </p>
                    <p className='seerrMediaCard-overview'>
                        {media.overview || 'No description available.'}
                    </p>
                    <span className='seerrMediaCard-view'>
                        {media.mediaType === 'tv' ? 'View seasons' : 'View details'}
                    </span>
                </div>
            </button>
        </article>
    );
};

export default SeerrMediaCard;
