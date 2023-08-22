import './user.css';
import { Box, Container } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useGetUsersQuery } from '../../features/users/usersApiSlice';
import { Link, useSearchParams } from 'react-router-dom';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import CustomPagination from '../../components/custom-pagination/CustomPagination';
import useTitle from '../../hooks/useTitle';
import User from '../../components/user/User';

const defaultSize = 8;
export default function Users() {
    const[searchParams, setSearchParams] = useSearchParams();
    const[pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || defaultSize,
        numberOfPages: 0,
    })
    const { data: users, isLoading, isSuccess, isError } = useGetUsersQuery({ 
        page: pagination.currPage, 
        size: pagination.pageSize 
    }, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
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
        content = [...new Array(pagination.pageSize)].map((element, index) => {
            return (<User key={index} />)
        })
    } else if (isSuccess) {
        const { ids, entities } = users;

        content = ids?.length
            ? ids.map(userId => {
                const user = entities[userId];
                return (<User key={user.id} user={user}/>)
            })
            : <p>Không có người dùng nào</p>
    } else if (isError){
        content = <p>Đã có lỗi xảy ra khi tải người dùng!</p>
    }

    return (
        <div className="usersContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={"Quản lý người dùng"} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <h1 className="alternativeTitle"> QUẢN LÝ NGƯỜI DÙNG</h1>
                    <Link to="/new-user" className="addButton">
                        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                        Thêm người dùng
                    </Link>
                </Box>
                {content}
                <CustomPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Container>
        </div>
    )
}
