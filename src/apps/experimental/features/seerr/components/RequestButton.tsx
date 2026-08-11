import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
            <Button
                size='small'
                variant='outlined'
                startIcon={<CheckIcon />}
                disabled
            >
                Available
            </Button>
        );
    }

    if (requestStatus === 1 || requestStatus === 2) {
        return (
            <Button
                size='small'
                variant='outlined'
                startIcon={<CheckIcon />}
                disabled
            >
                {requestStatus === 1 ? 'Requested' : 'Approved'}
            </Button>
        );
    }

    return (
        <Button
            size='small'
            variant='contained'
            startIcon={isSubmitting ? <CircularProgress color='inherit' size={16} /> : <AddIcon />}
            onClick={onClick}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Requesting…' : 'Request'}
        </Button>
    );
};

export default RequestButton;
