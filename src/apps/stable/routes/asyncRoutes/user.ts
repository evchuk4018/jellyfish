import { AsyncRoute } from '../../../../components/router/AsyncRoute';

export const ASYNC_USER_ROUTES: AsyncRoute[] = [
    { path: 'mypreferencesmenu', page: 'user/settings' },
    { path: 'quickconnect', page: 'quickConnect' },
    { path: 'search', page: 'search' },
    { path: 'discover', page: 'discover' },
    { path: 'requests', page: 'requests' },
    { path: 'userprofile', page: 'user/userprofile' }
];
