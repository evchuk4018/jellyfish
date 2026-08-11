const LOG_PREFIX = '[jellyfin-playback]';

function getLogger(level) {
    if (typeof console === 'undefined') {
        return null;
    }

    return console[level] || console.log;
}

export function logPlayback(level, event, details) {
    const logger = getLogger(level);

    if (logger) {
        logger.call(console, `${LOG_PREFIX} ${event}`, details || {});
    }
}

export function sanitizePlaybackUrl(value) {
    if (!value) {
        return value;
    }

    const url = String(value);

    if (url.startsWith('blob:') || url.startsWith('data:')) {
        return url.split(':')[0] + ':';
    }

    try {
        const parsed = new URL(url, 'http://jellyfin.invalid');
        const queryKeys = Array.from(parsed.searchParams.keys());
        const query = queryKeys.length ? `?${queryKeys.join('&')}` : '';
        return `${parsed.pathname}${query}${parsed.hash ? '#...' : ''}`;
    } catch {
        return url.split('?')[0];
    }
}

function summarizePath(value) {
    if (!value) {
        return value;
    }

    const path = String(value).replaceAll('\\', '/');
    return path.split('/').pop() || '[path]';
}

function summarizeMediaStream(stream) {
    return {
        index: stream.Index,
        type: stream.Type,
        codec: stream.Codec,
        profile: stream.Profile,
        language: stream.Language,
        channels: stream.Channels,
        sampleRate: stream.SampleRate,
        width: stream.Width,
        height: stream.Height,
        deliveryMethod: stream.DeliveryMethod
    };
}

export function summarizeMediaSource(mediaSource) {
    if (!mediaSource) {
        return null;
    }

    const streams = Array.isArray(mediaSource.MediaStreams) ? mediaSource.MediaStreams : [];

    return {
        id: mediaSource.Id,
        protocol: mediaSource.Protocol,
        container: mediaSource.Container,
        path: summarizePath(mediaSource.Path),
        streamUrl: sanitizePlaybackUrl(mediaSource.StreamUrl),
        transcodingUrl: sanitizePlaybackUrl(mediaSource.TranscodingUrl),
        transcodingContainer: mediaSource.TranscodingContainer,
        transcodingSubProtocol: mediaSource.TranscodingSubProtocol,
        isRemote: mediaSource.IsRemote,
        isLocal: mediaSource.IsLocal,
        supportsDirectPlay: mediaSource.SupportsDirectPlay,
        supportsDirectStream: mediaSource.SupportsDirectStream,
        supportsTranscoding: mediaSource.SupportsTranscoding,
        enableDirectPlay: mediaSource.enableDirectPlay,
        requiresOpening: mediaSource.RequiresOpening,
        defaultAudioStreamIndex: mediaSource.DefaultAudioStreamIndex,
        defaultSubtitleStreamIndex: mediaSource.DefaultSubtitleStreamIndex,
        mediaStreamCount: streams.length,
        playableStreams: streams
            .filter(stream => stream.Type === 'Video' || stream.Type === 'Audio')
            .map(summarizeMediaStream)
    };
}

function summarizeProfileEntry(profile) {
    return {
        container: profile.Container,
        type: profile.Type,
        videoCodec: profile.VideoCodec,
        audioCodec: profile.AudioCodec,
        protocol: profile.Protocol,
        context: profile.Context
    };
}

export function summarizeDeviceProfile(profile) {
    if (!profile) {
        return null;
    }

    return {
        maxStreamingBitrate: profile.MaxStreamingBitrate,
        maxStaticBitrate: profile.MaxStaticBitrate,
        directPlayProfiles: (profile.DirectPlayProfiles || []).map(summarizeProfileEntry),
        transcodingProfiles: (profile.TranscodingProfiles || []).map(summarizeProfileEntry)
    };
}

export function summarizePlaybackError(error) {
    if (!error) {
        return null;
    }

    return {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type,
        status: error.status
    };
}

export function summarizeMediaElement(element) {
    if (!element) {
        return null;
    }

    return {
        src: sanitizePlaybackUrl(element.currentSrc || element.src),
        readyState: element.readyState,
        networkState: element.networkState,
        videoWidth: element.videoWidth,
        videoHeight: element.videoHeight,
        duration: element.duration,
        paused: element.paused,
        error: element.error ? {
            code: element.error.code,
            message: element.error.message
        } : null
    };
}
