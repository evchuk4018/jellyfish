import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from 'hooks/useApi';
import { useWebConfig } from 'hooks/useWebConfig';

import type {
    SeerrDiscoverResponse,
    SeerrMediaType,
    SeerrRequestsResponse
} from './types';

const SEERR_QUERY_KEY = 'seerr';
const DEFAULT_BRIDGE_URL = '/music/api/seerr';

type RequestInput = {
    mediaType: SeerrMediaType;
    mediaId: number;
    tvdbId?: number;
};

const getBridgeUrl = (configuredUrl?: string) => (
    (configuredUrl || DEFAULT_BRIDGE_URL).replace(/\/$/, '')
);

const getToken = (apiClient: ReturnType<typeof useApi>['__legacyApiClient__']) => {
    const token = apiClient?.accessToken();
    return token || undefined;
};

const requestBridge = async <T>(
    bridgeUrl: string,
    token: string,
    path: string,
    init: RequestInit = {}
) => {
    const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };
    if (init.body) headers['Content-Type'] = 'application/json';

    const response = await fetch(`${bridgeUrl}${path}`, {
        ...init,
        headers,
        credentials: 'omit'
    });

    if (!response.ok) {
        const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
        throw new Error(body?.error || `Seerr request failed with status ${response.status}`);
    }

    return await response.json() as T;
};

export const useSeerrDiscover = (query: string, page = 1) => {
    const { __legacyApiClient__ } = useApi();
    const webConfig = useWebConfig();
    const token = getToken(__legacyApiClient__);
    const bridgeUrl = getBridgeUrl(webConfig.seerrBridgeUrl);

    return useQuery({
        queryKey: [ SEERR_QUERY_KEY, 'discover', bridgeUrl, query, page ],
        queryFn: () => requestBridge<SeerrDiscoverResponse>(
            bridgeUrl,
            token || '',
            `/discover?q=${encodeURIComponent(query)}&page=${page}`
        ),
        enabled: Boolean(token),
        staleTime: 60_000
    });
};

export const useSeerrRequests = () => {
    const { __legacyApiClient__ } = useApi();
    const webConfig = useWebConfig();
    const token = getToken(__legacyApiClient__);
    const bridgeUrl = getBridgeUrl(webConfig.seerrBridgeUrl);

    return useQuery({
        queryKey: [ SEERR_QUERY_KEY, 'requests', bridgeUrl ],
        queryFn: () => requestBridge<SeerrRequestsResponse>(
            bridgeUrl,
            token || '',
            '/requests'
        ),
        enabled: Boolean(token),
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
            const token = getToken(__legacyApiClient__);
            if (!token) throw new Error('A Jellyfin authentication token is required');

            return requestBridge<{ id: number }>(
                bridgeUrl,
                token,
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
