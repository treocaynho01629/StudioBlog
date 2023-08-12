import './user.css';
import { Container } from '@mui/material';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import CustomPagination from '../../components/custom-pagination/CustomPagination';
import { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { useGetUsersQuery } from '../../features/users/usersApiSlice';
import { useSearchParams } from 'react-router-dom';
import User from '../../components/user/User';

const defaultSize = 8;
export default function Users() {
    const[searchParams, setSearchParams] = useSearchParams();
    const[pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || defaultSize,
        numberOfPages: 0,
    })
    const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery({ 
        page: pagination.currPage, 
        size: pagination.pageSize 
    });
    useTitle(`Quản lý người dùng - TAM PRODUCTION`);

    useEffect(() => {
        if (!isLoading && isSuccess && users){
            setPagination({ ...pagination, numberOfPages: users?.info?.numberOfPages});
        }
    }, [isSuccess])

    const handlePageChange = (page) => {
        if (page === 1){
            searchParams.delete("page");
            setSearchParams(searchParams);
        } else {
            searchParams.set("page", page);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, currPage: page});
    }

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        if (newValue === defaultSize){
            searchParams.delete("size");
            setSearchParams(searchParams);
        } else {
            searchParams.set("size", newValue);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, pageSize: newValue});
    }

    let content;
    
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = users;

        content = ids?.length
            ? ids.map(userId => {
                const user = entities[userId];
                return (<User key={user.id} user={user}/>)
            })
            : null
    } else if (isError){
        content = <p>{error}</p>
    }

    return (
        <div className="usersContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={"Quản lý người dùng"} />
                <h1 className="alternativeTitle">QUẢN LÝ NGƯỜI DÙNG</h1>
                {content}
                <CustomPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Container>
        </div>
    )
}
