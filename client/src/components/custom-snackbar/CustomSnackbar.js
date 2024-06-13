import { Alert, Snackbar } from '@mui/material'
import { useState } from 'react';

const CustomSnackbar = ({ variant, message, duration }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={variant}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar