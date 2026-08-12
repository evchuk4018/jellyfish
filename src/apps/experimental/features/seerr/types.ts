export type SeerrMediaType = 'movie' | 'tv';

export type SeerrMedia = {
    id: number;
    mediaType: SeerrMediaType;
    title: string;
    overview: string;
    posterUrl?: string;
    releaseDate?: string;
    available: boolean;
    requestStatus?: number;
};

export type SeerrSeason = {
    seasonNumber: number;
    name: string;
    episodeCount: number;
    overview: string;
    posterUrl?: string;
    airDate?: string;
    available: boolean;
    partiallyAvailable: boolean;
    requestStatus?: number;
};

export type SeerrMediaDetail = SeerrMedia & {
    backdropUrl?: string;
    tagline?: string;
    genres: string[];
    seasons?: SeerrSeason[];
};

export type SeerrRequestInput = {
    mediaType: SeerrMediaType;
    mediaId: number;
    tvdbId?: number;
    seasons?: number[];
};

export type SeerrRequest = {
    id: number;
    mediaId: number;
    mediaType: SeerrMediaType;
    title: string;
    overview: string;
    posterUrl?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type SeerrDiscoverResponse = {
    page: number;
    totalPages: number;
    results: SeerrMedia[];
};

export type SeerrRequestsResponse = {
    results: SeerrRequest[];
};
