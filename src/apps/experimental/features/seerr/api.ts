import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from 'hooks/useApi';
import { useWebConfig } from 'hooks/useWebConfig';
import { ServerConnections } from 'lib/jellyfin-apiclient';

import type {
    SeerrDiscoverResponse,
    SeerrMediaType,
    SeerrRequestsResponse
} from './types';
import { selectSeerrAuthToken } from './auth';

const SEERR_QUERY_KEY = 'seerr';
const DEFAULT_BRIDGE_URL = '/music/api/seerr';
const REQUEST_TIMEOUT_MS = 15_000;

type RequestInput = {
    mediaType: SeerrMediaType;
    mediaId: number;
    tvdbId?: number;
};

const getBridgeUrl = (configuredUrl?: string) => (
    (configuredUrl || DEFAULT_BRIDGE_URL).replace(/\/$/, '')
);

type LegacyApiClient = ReturnType<typeof useApi>['__legacyApiClient__'];

const getToken = (apiClient?: LegacyApiClient) => selectSeerrAuthToken(
    apiClient,
    ServerConnections.currentApiClient()
);

const requireToken = (apiClient?: LegacyApiClient) => {
    const token = getToken(apiClient);
    if (!token) throw new Error('A Jellyfin authentication token is required');
    return token;
};

const requestBridge = async <T>(
    bridgeUrl: string,
    token: string,
    path: string,
    init: RequestInit = {}
) => {
    const endpoint = path.split('?')[0];
    let timeout: ReturnType<typeof globalThis.setTimeout>;
    const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };
    if (init.body) headers['Content-Type'] = 'application/json';

    console.debug('[seerr-bridge] request started', {
        endpoint,
        method: init.method || 'GET'
    });

    let response: Response;
    try {
        response = await Promise.race([
            fetch(`${bridgeUrl}${path}`, {
                ...init,
                headers,
                cache: 'no-store',
                credentials: 'omit'
            }),
            new Promise<never>((_resolve, reject) => {
                timeout = globalThis.setTimeout(
                    () => reject(new Error('Seerr did not respond within 15 seconds')),
                    REQUEST_TIMEOUT_MS
                );
            })
        ]);
    } finally {
        globalThis.clearTimeout(timeout!);
    }

    if (!response.ok) {
        const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
        console.warn('[seerr-bridge] request failed', {
            endpoint,
            status: response.status
        });
        throw new Error(body?.error || `Seerr request failed with status ${response.status}`);
    }

    const body = await response.json() as T;
    console.debug('[seerr-bridge] request completed', {
        endpoint,
        status: response.status
    });
    return body;
};

export const useSeerrDiscover = (query: string, page = 1) => {
    const { __legacyApiClient__ } = useApi();
    const webConfig = useWebConfig();
    const bridgeUrl = getBridgeUrl(webConfig.seerrBridgeUrl);

    return useQuery({
        queryKey: [ SEERR_QUERY_KEY, 'discover', bridgeUrl, query, page ],
        queryFn: () => requestBridge<SeerrDiscoverResponse>(
            bridgeUrl,
            requireToken(__legacyApiClient__),
            `/discover?q=${encodeURIComponent(query)}&page=${page}`
        ),
        retry: false,
        staleTime: 60_000
    });
};

export const useSeerrRequests = () => {
    const { __legacyApiClient__ } = useApi();
    const webConfig = useWebConfig();
    const bridgeUrl = getBridgeUrl(webConfig.seerrBridgeUrl);

    return useQuery({
        queryKey: [ SEERR_QUERY_KEY, 'requests', bridgeUrl ],
        queryFn: () => requestBridge<SeerrRequestsResponse>(
            bridgeUrl,
            requireToken(__legacyApiClient__),
            '/requests'
        ),
        retry: false,
        staleTime: 30_000
    });
};

export const useCreateSeerrRequest = () => {
    const { __legacyApiClient__ } = useApi();
    const webConfig = useWebConfig();
    const queryClient = useQueryClient();
    const bridgeUrl = getBridgeUrl(webConfig.seerrBridgeUrl);

    return useMutation({
        mutationFn: async (input: RequestInput) => {
            return requestBridge<{ id: number }>(
                bridgeUrl,
                requireToken(__legacyApiClient__),
                '/requests',
                {
                    method: 'POST',
                    body: JSON.stringify(input)
                }
            );
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: [ SEERR_QUERY_KEY ]
            });
        }
    });
};
