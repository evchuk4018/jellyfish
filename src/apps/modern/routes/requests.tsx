import OpenInNew from '@mui/icons-material/OpenInNew';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import { useWebConfig } from 'hooks/useWebConfig';

export const Component = () => {
    const { seerr } = useWebConfig();
    const name = seerr?.name || 'Requests';
    const url = seerr?.url || '/seerr/';

    if (!seerr?.enabled) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant='h5' component='h1' gutterBottom>
                    {name}
                </Typography>
                <Alert severity='info'>
                    Seerr integration is disabled in config.json.
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'calc(100dvh - 3.5rem)',
                minHeight: '32rem'
            }}
        >
            <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                spacing={2}
                sx={{ px: 2, py: 1 }}
            >
                <Typography variant='h6' component='h1'>
                    {name}
                </Typography>
                <Button
                    component='a'
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    endIcon={<OpenInNew />}
                >
                    Open Seerr
                </Button>
            </Stack>

            <Box
                component='iframe'
                title={name}
                src={url}
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    border: 0,
                    bgcolor: 'background.default'
                }}
            />
        </Box>
    );
};
