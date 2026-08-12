import { describe, expect, it } from 'vitest';

import { createSeerrRequestInput } from './requestInput';

describe('createSeerrRequestInput', () => {
    it('creates exactly one season for TV requests', () => {
        expect(createSeerrRequestInput({ id: 60625, mediaType: 'tv' }, 9)).toEqual({
            mediaId: 60625,
            mediaType: 'tv',
            seasons: [ 9 ]
        });
    });

    it('does not send seasons for movie requests', () => {
        expect(createSeerrRequestInput({ id: 1, mediaType: 'movie' })).toEqual({
            mediaId: 1,
            mediaType: 'movie',
            seasons: undefined
        });
    });
});
