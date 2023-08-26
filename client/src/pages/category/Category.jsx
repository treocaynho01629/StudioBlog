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

const defaultSize = 8;
export default function Category() {
    const { cate } = useParams();
    const[searchParams, setSearchParams] = useSearchParams();
    const[pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || defaultSize,
        numberOfPages: 0,
    })
    const { data: posts, isLoading, isSuccess, isError } = useGetPostsQuery({ 
        cate, 
        page: pagination.currPage, 
        size: pagination.pageSize 
    });
    const category = useSelector(state => selectCategoryById(state, cate));
    useTitle(`${category?.name.toUpperCase() || 'Danh mục'} - TAM PRODUCTION`);

    useEffect(() => {
        if (!isLoading && isSuccess && posts.info){
            setPagination({ ...pagination, numberOfPages: posts?.info?.numberOfPages});
        }
    }, [posts?.info])

    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page});
        if (page === 1){
            searchParams.delete("page");
            setSearchParams(searchParams);
        } else {
            searchParams.set("page", page);
            setSearchParams(searchParams);
        }
    }

    const handleChangeSize = (newValue) => {
        setPagination({...pagination, pageSize: newValue, currPage: 1});
        searchParams.delete("page");
        if (newValue === defaultSize){
            searchParams.delete("size");
            setSearchParams(searchParams);
        } else {
            searchParams.set("size", newValue);
            setSearchParams(searchParams);
        }
    }

    let content;
    
    if (isLoading) {
        content = [...new Array(pagination.pageSize)].map((element, index) => {
            return (<Post key={index}/>)
        })
    } else if (isSuccess) {
        const { ids, entities } = posts;

        content = ids?.length
            ? ids.map(postId => {
                const post = entities[postId];
                return (<Post key={post.id} post={post}/>)
            })
            : <p>Không có bài viết nào</p>
    } else if (isError) {
        content = <p>Đã xảy ra lỗi khi tải bài viết!</p>;
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
