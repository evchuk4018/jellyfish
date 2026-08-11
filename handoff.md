# Jellyfin playback failure handoff

## Current conclusion

The downloaded episode is present, readable, and indexed by Jellyfin. The failure is occurring after the web client starts playback, most likely while selecting or handing the stream to the browser's native media element. The file is an MKV containing HEVC Main 10 video and E-AC-3 5.1 audio, so browser codec/container support is still the leading hypothesis, but the new client logs are needed to confirm it.

## Evidence collected

- Episode: `Rick and Morty / Season 9 / Field of Dreams`.
- File is present at `/srv/storage/media/tv/Rick and Morty/Season 9/...mkv` and is about 495 MB.
- Jellyfin's container user can read the file.
- `ffprobe` identifies HEVC 1920x1080 Main 10 video and two E-AC-3 6-channel audio streams; subtitles are present.
- Jellyfin's database contains the episode and its media streams.
- Jellyfin's `PlaybackInfo` API returned one media source with direct play, direct stream, and transcoding capabilities.
- At `2026-08-11T02:59:17Z`, Jellyfin logged `PlaybackStart reported with null media info` for the attempt. No recent transcoding output or ffmpeg error was found, which points toward a client-side/native-player failure before a successful transcode session.

## Diagnostic changes

The following files now emit structured messages with the `[jellyfin-playback]` prefix:

- `src/components/playback/playbackmanager.js`: PlaybackInfo request/response, source candidates, selected source, generated stream URL, player rejection, and transcoding retry.
- `src/plugins/htmlVideoPlayer/plugin.js`: native source assignment, metadata, native play rejection, media-element errors, and zero-dimension video state.
- `src/components/htmlMediaHelper.js`: native `play()` and player-error events.
- `src/components/playback/playbackDebug.js`: shared redaction and summary helpers. URL query values are not logged, so API-key values are not exposed.

## Reproduction

1. Open Jellyfin and press play on the episode again.
2. Open browser developer tools with `F12`, select **Console**, and filter for `[jellyfin-playback]`.
3. Copy the complete sequence from `PlaybackInfo request` through the final `Playback error` or `Native media element error`. Do not copy raw Network URLs; they can contain an API key.

## How to read the result

- `PlaybackInfo response` with `mediaSourceCount: 0` or an `errorCode` means source negotiation failed before the player.
- `Stream info created` with `playMethod: DirectPlay` or `DirectStream`, followed by native error code `4` or `NotSupportedError`, confirms browser codec/container incompatibility or an unusable direct stream.
- `Retrying playback with transcoding` followed by another `PlaybackInfo response` shows the automatic fallback was attempted.
- `Native media has no video dimensions` means the element started reporting time without a usable video track and explains the exact `NO_MEDIA_ERROR` message.

## Verification status

- `npm run build:check`: passed.
- `npm test -- --run`: passed, 160 tests.
- Local production build was allowed to run for 180 seconds but timed out without a webpack error; it only emitted the repository's stale Browserslist-data warning. The homelab rebuild script uses its own reproducible build stage and still needs to publish this diagnostic bundle.

## Next action

Publish the diagnostic frontend to the homelab, reproduce once, and use the console sequence above. If it confirms a direct-stream/native codec failure, the next fix should force a compatible transcode profile for this browser or correct the selected playback URL rather than changing the downloaded file.
