import './category.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import { selectCategoryById } from '../../features/categories/categoriesApiSlice';
import { useSelector } from 'react-redux';
import useTitle from '../../hooks/useTitle';
import CustomPagination from '../../components/custom-pagination/CustomPagination';
import { useEffect, useState } from 'react';

export default function Category() {
    const { cate } = useParams();
    const[searchParams, setSearchParams] = useSearchParams();
    const[pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || 8,
        numberOfPages: 0,
    })
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery({ 
        cate, 
        page: pagination.currPage, 
        size: pagination.pageSize 
    });
    const category = useSelector(state => selectCategoryById(state, cate));
    useTitle(`${category?.name.toUpperCase()} - TAM PRODUCTION`);

    useEffect(() => {
        if (!isLoading && isSuccess && posts){
            setPagination({ ...pagination, numberOfPages: posts?.info?.numberOfPages});
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
        if (newValue === 8){
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
        const { ids, entities } = posts;

        content = ids?.length
            ? ids.map(postId => {
                const post = entities[postId];
                return (<Post key={post.id} post={post}/>)
            })
            : null
    } else if (isError){
        content = <p>{error}</p>
    }

    return (
        <div className="cateContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={category?.name}/>
                <h1 className="alternativeTitle">DANH MỤC: {category?.name.toUpperCase()}</h1>
                {content}
                <CustomPagination pagination={pagination}
                onPageChange={handlePageChange}
                onSizeChange={handleChangeSize}/>
            </Container>
        </div>
    )
}
