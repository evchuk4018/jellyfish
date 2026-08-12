import React, { type FC } from 'react';

interface RequestButtonProps {
    available: boolean;
    requestStatus?: number;
    isSubmitting?: boolean;
    onClick: () => void;
}

const RequestButton: FC<RequestButtonProps> = ({
    available,
    requestStatus,
    isSubmitting = false,
    onClick
}) => {
    if (available) {
        return (
            <button
                type='button'
                className='seerrRequestButton seerrRequestButton-complete'
                disabled
            >
                Available
            </button>
        );
    }

    if (requestStatus === 1 || requestStatus === 2) {
        return (
            <button
                type='button'
                className='seerrRequestButton seerrRequestButton-complete'
                disabled
            >
                {requestStatus === 1 ? 'Requested' : 'Approved'}
            </button>
        );
    }

    return (
        <button
            type='button'
            className='seerrRequestButton'
            onClick={onClick}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Requesting...' : '+ Request'}
        </button>
    );
};

export default RequestButton;
