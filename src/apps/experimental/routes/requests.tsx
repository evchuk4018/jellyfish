import React from 'react';

import Page from 'components/Page';

import { useSeerrRequests } from 'apps/experimental/features/seerr/api';
import SeerrRequestCard from 'apps/experimental/features/seerr/components/SeerrRequestCard';

import 'apps/experimental/features/seerr/seerr.scss';

const Requests = () => {
    const requests = useSeerrRequests();
    let requestContent: React.ReactNode;

    if (requests.isPending) {
        requestContent = (
            <div role='status' className='seerrNotice seerrNotice-loading'>
                Loading Seerr requests…
            </div>
        );
    } else if (requests.isError) {
        requestContent = (
            <div role='alert' className='seerrNotice seerrNotice-error'>
                {requests.error.message}
            </div>
        );
    } else if (requests.data?.results.length) {
        const resultCount = requests.data.results.length;
        requestContent = (
            <section className='seerrRequestList' aria-label='Your Seerr requests'>
                <div role='status' className='seerrNotice seerrNotice-success'>
                    {resultCount} request{resultCount === 1 ? '' : 's'} from Seerr
                </div>
                {requests.data.results.map(request => (
                    <SeerrRequestCard key={request.id} request={request} />
                ))}
            </section>
        );
    } else {
        requestContent = (
            <div role='status' className='seerrNotice seerrNotice-success'>
                You have not requested any media yet.
            </div>
        );
    }

    return (
        <Page
            id='requestsPage'
            className='mainAnimatedPage libraryPage noSecondaryNavPage seerrPage'
            title='My Requests'
        >
            <div className='padded-left padded-right padded-bottom-page seerrPage-content'>
                <header className='seerrPage-header'>
                    <h1>My Requests</h1>
                    <p>Track the movies and TV shows you have requested.</p>
                </header>
                {requestContent}
            </div>
        </Page>
    );
};

export default Requests;
