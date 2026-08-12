import { describe, expect, it } from 'vitest';

import { getSeerrDetailPath, getSeerrDiscoverPath } from './navigation';

describe('Seerr discovery navigation', () => {
    it('preserves an encoded search query while opening details', () => {
        expect(getSeerrDetailPath({ id: 60625, mediaType: 'tv' }, 'Rick & Morty'))
            .toBe('/discover/tv/60625?q=Rick%20%26%20Morty');
    });

    it('returns to the unfiltered discovery page without a query', () => {
        expect(getSeerrDiscoverPath('  ')).toBe('/discover');
    });
});
