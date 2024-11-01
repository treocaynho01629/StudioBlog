import { Suspense, lazy, useState } from 'react'
const CustomSnackbar = lazy(() => import("../custom-snackbar/CustomSnackbar"));

const Reachable = () => {
    const [connected, setConnected] = useState(true);

    const useReachable = async () => { //Fire a snack notification if it take too long to reach the server
        const timeout = new Promise((resolve, reject) => {
            setTimeout(reject, 5000, 'Request timed out'); //5000ms
        });
        const request = fetch(process.env.REACT_APP_BASE_URL);
        return Promise
            .race([timeout, request])
            .then(response => {
                console.log('Connected');
                setConnected(true);
            })
            .catch(async error => {
                setConnected(false);
            });
    }

    useReachable();
    return (!connected ?
        <Suspense fallback={null}>
            <CustomSnackbar {...{ variant: 'warning', message: 'Server có thể mất một lúc để khởi động!', duration: 30000 }} />
        </Suspense>
        : null
    )
}

export default Reachable