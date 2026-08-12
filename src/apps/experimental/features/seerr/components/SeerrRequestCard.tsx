import React, { type FC } from 'react';

import type { SeerrRequest } from '../types';

interface SeerrRequestCardProps {
    request: SeerrRequest;
}

const statusLabel = (status?: number) => {
    switch (status) {
        case 1: return 'Pending approval';
        case 2: return 'Approved';
        case 3: return 'Declined';
        default: return 'Processing';
    }
};

const SeerrRequestCard: FC<SeerrRequestCardProps> = ({ request }) => (
    <article className='seerrRequestCard'>
        <div className='seerrRequestCard-poster'>
            {request.posterUrl ? (
                <img
                    src={request.posterUrl}
                    alt={request.title}
                    loading='lazy'
                />
            ) : null}
        </div>
        <div className='seerrRequestCard-content'>
            <h2>{request.title}</h2>
            <p className='seerrMediaCard-meta'>
                {request.mediaType === 'movie' ? 'Movie' : 'TV'} • {statusLabel(request.status)}
            </p>
            {request.overview ? <p className='seerrRequestCard-overview'>{request.overview}</p> : null}
        </div>
    </article>
);

export default SeerrRequestCard;
