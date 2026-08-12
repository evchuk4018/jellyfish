import type { SeerrMedia, SeerrRequestInput } from './types';

export const createSeerrRequestInput = (
    media: Pick<SeerrMedia, 'id' | 'mediaType'>,
    seasonNumber?: number
): SeerrRequestInput => {
    const seasons = media.mediaType === 'tv'
        && seasonNumber !== undefined
        && Number.isInteger(seasonNumber) ? [ seasonNumber ] : undefined;

    return {
        mediaId: media.id,
        mediaType: media.mediaType,
        seasons
    };
};
