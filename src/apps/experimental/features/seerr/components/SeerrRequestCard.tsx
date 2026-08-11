import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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
    <Card sx={{ display: 'flex', minHeight: 150 }}>
        <div
            style={{
                width: 100,
                flexShrink: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden'
            }}
        >
            {request.posterUrl && (
                <img
                    src={request.posterUrl}
                    alt={request.title}
                    loading='lazy'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </div>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography component='h2' variant='h6'>{request.title}</Typography>
            <Typography variant='caption' color='text.secondary'>
                {request.mediaType === 'movie' ? 'Movie' : 'TV'} • {statusLabel(request.status)}
            </Typography>
            {request.overview && (
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2
                    }}
                >
                    {request.overview}
                </Typography>
            )}
        </CardContent>
    </Card>
);

export default SeerrRequestCard;
