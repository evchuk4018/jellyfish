import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    aspectRatio: '2 / 3',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden'
                }}
            >
                {media.posterUrl ? (
                    <img
                        src={media.posterUrl}
                        alt={media.title}
                        loading='lazy'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Stack
                        alignItems='center'
                        justifyContent='center'
                        sx={{ height: '100%', p: 2, textAlign: 'center' }}
                    >
                        <Typography color='text.secondary'>No artwork</Typography>
                    </Stack>
                )}
            </div>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1 }}>
                <Typography component='h2' variant='h6' sx={{ lineHeight: 1.2 }}>
                    {media.title}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                    {media.mediaType === 'movie' ? 'Movie' : 'TV'}{formatYear(media.releaseDate) ? ` • ${formatYear(media.releaseDate)}` : ''}
                </Typography>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        minHeight: '4.5em'
                    }}
                >
                    {media.overview || 'No description available.'}
                </Typography>
                <Stack direction='row' justifyContent='flex-end' sx={{ mt: 'auto', pt: 1 }}>
                    <RequestButton
                        available={media.available}
                        requestStatus={media.requestStatus}
                        isSubmitting={isSubmitting}
                        onClick={onRequestClick}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SeerrMediaCard;
