import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import Loading from 'components/loading/LoadingComponent';
import Page from 'components/Page';
import SeerrRequestCard from 'apps/experimental/features/seerr/components/SeerrRequestCard';
import { useSeerrRequests } from 'apps/experimental/features/seerr/api';

const Requests = () => {
    const requests = useSeerrRequests();
    let requestContent: React.ReactNode;

    if (requests.isPending) {
        requestContent = <Loading />;
    } else if (requests.data?.results.length) {
        requestContent = (
            <Stack spacing={2}>
                {requests.data.results.map(request => (
                    <SeerrRequestCard key={request.id} request={request} />
                ))}
            </Stack>
        );
    } else {
        requestContent = <Typography color='text.secondary'>You have not requested any media yet.</Typography>;
    }

    return (
        <Page
            id='requestsPage'
            className='libraryPage noSecondaryNavPage'
            title='My Requests'
        >
            <Box className='padded-left padded-right padded-bottom-page' sx={{ pt: 3 }}>
                <Stack spacing={3}>
                    <Stack spacing={1}>
                        <Typography component='h1' variant='h4'>My Requests</Typography>
                        <Typography color='text.secondary'>Track the movies and TV shows you have requested.</Typography>
                    </Stack>
                    {requests.isError && <Alert severity='error'>{requests.error.message}</Alert>}
                    {requestContent}
                </Stack>
            </Box>
        </Page>
    );
};

export default Requests;
