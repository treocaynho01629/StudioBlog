import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Close, Done } from '@mui/icons-material';

const useConfirm = (title, message) => {
    const [promise, setPromise] = useState(null);

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog
            open={promise !== null}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className="mainButton" onClick={handleConfirm}>OK <Done sx={{marginLeft: 1}}/></button>
                <button className="dangerButton" onClick={handleCancel}>Huỷ <Close sx={{marginLeft: 1}}/></button>
            </DialogActions>
        </Dialog>
    );
    return [ConfirmationDialog, confirm];
};

export default useConfirm;