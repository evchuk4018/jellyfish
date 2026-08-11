# Jellyfin Firefox playback fix handoff

## Diagnosis

- Affected item: `Rick and Morty / Season 9 / Field of Dreams`.
- Client: Firefox 153 on Windows 10.
- Source: MKV with HEVC Main 10 video, E-AC-3 5.1 audio, and 39 embedded
  subtitle streams.
- The router same-path message is benign. The three bitrate probes succeed and
  are normal; they can also run automatically after reconnect.
- The original attempt stopped before `PlaybackInfo`. The item-details click
  dropped the playback promise, and the playback preflight had no structured
  logging, so failures could surface only as `Uncaught (in promise) undefined`.
- Firefox 153 has an open platform HEVC regression on Windows:
  https://bugzilla.mozilla.org/show_bug.cgi?id=2049680
- The media file is readable and healthy. The exact HEVC Main 10 stream passed
  a VAAPI decode and H.264 encode-to-null test in the Jellyfin container.

## Fix

- Firefox is excluded from the HEVC fMP4-HLS capability. Jellyfin therefore
  selects the reliable H.264/AAC HLS fallback for this MKV.
- AudioContext speaker probing is guarded so browser privacy restrictions
  cannot abort playback before `PlaybackInfo`; the temporary context is closed.
- The item-details playback promise is handled.
- Playback request, player selection, bitrate completion, remote-player
  delegation, and every preflight stage now emit redacted
  `[jellyfin-playback]` diagnostics.

## Verification

- `npm test -- --run`: 163 tests passed.
- `npm run build:check`: passed.
- Focused ESLint: no errors (pre-existing warnings only).
- `npm run build:production`: passed with only existing bundle-size and stale
  Browserslist warnings.
- Jellyfin `PlaybackInfo` with the fallback profile selected H.264/AAC HLS with
  `ContainerNotSupported,VideoCodecNotSupported,AudioCodecNotSupported`, and
  returned a valid HLS master playlist.

## Security note

The supplied browser console transcript contained an access token. That
specific browser session was revoked during the investigation. Do not include
raw WebSocket URLs, stored credentials, HLS playlist URLs, or network request
URLs in future logs; filter for `[jellyfin-playback]`, whose URL values are
redacted.
