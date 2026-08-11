import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Loading from 'components/loading/LoadingComponent';
import Page from 'components/Page';

import SeerrMediaCard from 'apps/experimental/features/seerr/components/SeerrMediaCard';
import { useCreateSeerrRequest, useSeerrDiscover } from 'apps/experimental/features/seerr/api';
import type { SeerrMedia } from 'apps/experimental/features/seerr/types';

const Discover = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [ searchValue, setSearchValue ] = useState(query);
    const [ requestingMediaId, setRequestingMediaId ] = useState<number>();
    const discover = useSeerrDiscover(query);
    const createRequest = useCreateSeerrRequest();

    const onSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuery = searchValue.trim();
        if (nextQuery) setSearchParams({ q: nextQuery });
        else setSearchParams({});
    }, [ searchValue, setSearchParams ]);

    const requestMedia = useCallback(async (media: SeerrMedia) => {
        setRequestingMediaId(media.id);
        try {
            await createRequest.mutateAsync({
                mediaId: media.id,
                mediaType: media.mediaType
            });
        } catch {
            // The mutation error is rendered below.
        } finally {
            setRequestingMediaId(undefined);
        }
    }, [ createRequest ]);

    const onRequest = useCallback((media: SeerrMedia) => {
        requestMedia(media).catch(() => undefined);
    }, [ requestMedia ]);

    const onSearchValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }, []);

    return (
        <Page
            id='discoverPage'
            className='libraryPage noSecondaryNavPage'
            title='Discover'
        >
            <Box className='padded-left padded-right padded-bottom-page' sx={{ pt: 3 }}>
                <Stack spacing={3}>
                    <Stack spacing={1}>
                        <Typography component='h1' variant='h4'>Discover</Typography>
                        <Typography color='text.secondary'>Find movies and TV shows to add to your Jellyfin library.</Typography>
                    </Stack>
                    <Box component='form' onSubmit={onSearchSubmit}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <TextField
                                fullWidth
                                value={searchValue}
                                label='Search movies and TV'
                                onChange={onSearchValueChange}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                startIcon={<SearchIcon />}
                                sx={{ minWidth: { sm: 120 } }}
                            >
                                Search
                            </Button>
                        </Stack>
                    </Box>
                    {createRequest.isError && (
                        <Alert severity='error'>{createRequest.error.message}</Alert>
                    )}
                    {discover.isError && (
                        <Alert severity='error'>{discover.error.message}</Alert>
                    )}
                    {discover.isPending ? <Loading /> : (
                        <>
                            {!discover.data?.results.length && (
                                <Typography color='text.secondary'>No movies or TV shows found.</Typography>
                            )}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: 2
                                }}
                            >
                                {discover.data?.results.map(media => (
                                    <SeerrMediaCard
                                        key={`${media.mediaType}-${media.id}`}
                                        media={media}
                                        isSubmitting={requestingMediaId === media.id}
                                        onRequest={onRequest}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                </Stack>
            </Box>
        </Page>
    );
};

export default Discover;
