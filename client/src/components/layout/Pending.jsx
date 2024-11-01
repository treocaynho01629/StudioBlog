import { Backdrop, CircularProgress } from '@mui/material'

const Pending = ({ open, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: 9999, position: 'fixed' }}  open={open}>
            <CircularProgress color="inherit" />&nbsp;&nbsp;{message}
        </Backdrop>
    )
}

export default Pending