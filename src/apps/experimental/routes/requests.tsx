import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import Page from 'components/Page';
import SeerrRequestCard from 'apps/experimental/features/seerr/components/SeerrRequestCard';
import { useSeerrRequests } from 'apps/experimental/features/seerr/api';

const Requests = () => {
    const requests = useSeerrRequests();
    let requestContent: React.ReactNode;

    if (requests.isPending) {
        requestContent = (
            <Stack
                role='status'
                direction='row'
                alignItems='center'
                spacing={1.5}
            >
                <CircularProgress size={24} />
                <Typography color='text.secondary'>Loading requests…</Typography>
            </Stack>
        );
    } else if (requests.isError) {
        requestContent = null;
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
                        <Typography component='h1' variant='h4' color='text.primary'>My Requests</Typography>
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
