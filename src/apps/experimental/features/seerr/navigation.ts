import type { SeerrMedia } from './types';

const withQuery = (path: string, query: string) => {
    const value = query.trim();
    return value ? `${path}?q=${encodeURIComponent(value)}` : path;
};

export const getSeerrDetailPath = (media: Pick<SeerrMedia, 'id' | 'mediaType'>, query: string) => (
    withQuery(`/discover/${media.mediaType}/${media.id}`, query)
);

export const getSeerrDiscoverPath = (query: string) => withQuery('/discover', query);
