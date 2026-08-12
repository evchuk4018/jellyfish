import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Page from 'components/Page';

import { useSeerrDiscover } from 'apps/experimental/features/seerr/api';
import SeerrMediaCard from 'apps/experimental/features/seerr/components/SeerrMediaCard';
import { getSeerrDetailPath } from 'apps/experimental/features/seerr/navigation';
import type { SeerrMedia } from 'apps/experimental/features/seerr/types';

import 'apps/experimental/features/seerr/seerr.scss';

const Discover = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [ searchValue, setSearchValue ] = useState(query);
    const discover = useSeerrDiscover(query);

    const onSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuery = searchValue.trim();
        if (nextQuery) setSearchParams({ q: nextQuery });
        else setSearchParams({});
    }, [ searchValue, setSearchParams ]);

    const onSelect = useCallback((media: SeerrMedia) => {
        navigate(getSeerrDetailPath(media, query));
    }, [ navigate, query ]);

    const onSearchValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }, []);

    let discoverContent: React.ReactNode;
    if (discover.isPending) {
        discoverContent = (
            <div role='status' className='seerrNotice seerrNotice-loading'>
                Loading Seerr results...
            </div>
        );
    } else if (discover.isError) {
        discoverContent = (
            <div role='alert' className='seerrNotice seerrNotice-error'>
                {discover.error.message}
            </div>
        );
    } else {
        const results = discover.data?.results || [];
        const resultCount = results.length;
        let resultLabel = 'No movies or TV shows found.';
        if (resultCount) {
            const suffix = resultCount === 1 ? '' : 's';
            resultLabel = `${resultCount} result${suffix} from Seerr`;
        }
        discoverContent = (
            <>
                <div role='status' className='seerrNotice seerrNotice-success'>
                    {resultLabel}
                </div>
                <section className='seerrResults' aria-label='Seerr search results'>
                    {results.map(media => (
                        <SeerrMediaCard
                            key={`${media.mediaType}-${media.id}`}
                            media={media}
                            onSelect={onSelect}
                        />
                    ))}
                </section>
            </>
        );
    }

    return (
        <Page
            id='discoverPage'
            className='mainAnimatedPage libraryPage noSecondaryNavPage seerrPage'
            title='Discover'
        >
            <div className='padded-left padded-right padded-bottom-page seerrPage-content'>
                <header className='seerrPage-header'>
                    <h1>Discover</h1>
                    <p>Find movies and TV shows to add to your Jellyfin library.</p>
                </header>
                <form onSubmit={onSearchSubmit} className='seerrSearch'>
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
                </form>
                {discoverContent}
            </div>
        </Page>
    );
};

export default Discover;
