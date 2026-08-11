import { describe, expect, it } from 'vitest';

import { supportsHevcInFmp4Hls } from './browserMediaCapabilities';

describe('supportsHevcInFmp4Hls', () => {
    it('uses H264 fallback for Firefox', () => {
        expect(supportsHevcInFmp4Hls({
            firefox: true,
            versionMajor: 153
        })).toBe(false);
    });

    it('allows HEVC for supported Chromium browsers', () => {
        expect(supportsHevcInFmp4Hls({
            chrome: true,
            versionMajor: 153
        })).toBe(true);
    });

    it('does not advertise HEVC to older Android Chromium browsers', () => {
        expect(supportsHevcInFmp4Hls({
            chrome: true,
            android: true,
            versionMajor: 104
        })).toBe(false);
    });
});
