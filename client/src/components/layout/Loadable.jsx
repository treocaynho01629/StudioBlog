import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';

export const Loader = () => {
    return (
        <>
            <div style={{ position: 'fixed', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, zIndex: 1200 }}>
                <CircularProgress color="inherit" />
            </div>
            <div style={{ height: '90dvh' }} />
        </>
    );
};

const Loadable = (Component) => (props) => (
    <Suspense fallback={<Loader />}>
        <Component {...props} />
    </Suspense>
);

export default Loadable;