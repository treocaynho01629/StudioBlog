import './search.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import useTitle from '../../hooks/useTitle';
import CustomPagination from '../../components/custom-pagination/CustomPagination';
import { useEffect, useState } from 'react';

const defaultSize = 8;
export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || defaultSize,
        numberOfPages: 0,
    });
    const[filters, setFilters] = useState({
        tags: searchParams.get("tags") ? searchParams.get("tags").split(',') : [],
        author: searchParams.get("author") || "",
        cate: searchParams.get("cate") || "",
    })
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery({ 
        tags: filters.tags,
        author: filters.author,
        cate: filters.cate,
        page: pagination.currPage, 
        size: pagination.pageSize 
    });
    useTitle(`Tìm kiếm - TAM PRODUCTION`);

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
        if (newValue === defaultSize){
            searchParams.delete("size");
            setSearchParams(searchParams);
        } else {
            searchParams.set("size", newValue);
            setSearchParams(searchParams);
        }
        setPagination({...pagination, pageSize: newValue});
    }

    const handleChangeTags = (newValue) => {
        handlePageChange(1);
        if (newValue.length === 0){
            searchParams.delete("tags");
            setSearchParams(searchParams);
        } else {
            searchParams.set("tags", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, tags: newValue});
    }

    const handleChangeAuthor= (newValue) => {
        handlePageChange(1);
        if (newValue === ""){
            searchParams.delete("author");
            setSearchParams(searchParams);
        } else {
            searchParams.set("author", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, author: newValue});
    }

    const handleChangeCate = (newValue) => {
        handlePageChange(1);
        if (newValue === ""){
            searchParams.delete("cate");
            setSearchParams(searchParams);
        } else {
            searchParams.set("cate", newValue);
            setSearchParams(searchParams);
        }
        setFilters({...filters, cate: newValue});
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
                <BreadCrumbs route={'Tìm kiếm'}/>
                <h1 className="alternativeTitle">TÌM KIẾM BÀI VIẾT</h1>
                {content}
                <CustomPagination pagination={pagination}
                onPageChange={handlePageChange}
                onSizeChange={handleChangeSize}/>
            </Container>
        </div>
    )
}
