import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';
import usePersist from '../../hooks/usePersist';

export default function PersistLogin() {
    const persist = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    const [trueSuccess, setTrueSuccess] = useState(false);

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log("Refreshing token");
                try {
                    await refresh()
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken();
        }

        return () => effectRan.current = true
    }, [])

    let content

    if (!persist) {
        content = <Outlet />
    } else if (isLoading) { 
        console.log("Đang xác thực đăng nhập!");
        content = <b style={{marginTop: '250px'}}>Loading ...</b>
    } else if (isError) { 
        console.log("Lỗi xác thực!");
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) {
        console.log("Xác thực hoàn tất!");
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }

    return content
}