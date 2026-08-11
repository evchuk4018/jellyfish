import { describe, expect, it, vi } from 'vitest';

import { selectSeerrAuthToken } from './auth';

describe('selectSeerrAuthToken', () => {
    it('uses the context client token when available', () => {
        const contextClient = { accessToken: vi.fn(() => 'context-token') };
        const currentClient = { accessToken: vi.fn(() => 'current-token') };

        expect(selectSeerrAuthToken(contextClient, currentClient)).toBe('context-token');
        expect(currentClient.accessToken).not.toHaveBeenCalled();
    });

    it('falls back to the current Jellyfin client', () => {
        const contextClient = { accessToken: vi.fn(() => undefined) };
        const currentClient = { accessToken: vi.fn(() => 'current-token') };

        expect(selectSeerrAuthToken(contextClient, currentClient)).toBe('current-token');
    });

    it('ignores empty tokens', () => {
        const emptyClient = { accessToken: vi.fn(() => '   ') };

        expect(selectSeerrAuthToken(undefined, emptyClient)).toBeUndefined();
    });
});
