export function supportsHevcInFmp4Hls(browserInfo) {
    // Firefox's platform HEVC support is currently unreliable on Windows,
    // including Firefox 153. Prefer the proven H264 HLS fallback there.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=2049680
    return !!(!browserInfo.firefox && (
        browserInfo.edgeChromium
        || browserInfo.safari
        || browserInfo.tizen
        || browserInfo.web0s
        || (browserInfo.chrome && (!browserInfo.android || browserInfo.versionMajor >= 105))
        || (browserInfo.opera && !browserInfo.mobile)
    ));
}
