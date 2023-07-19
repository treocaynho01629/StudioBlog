import './category.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';

export default function Category() {
    const {cate} = useParams();
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();

    let content;
    
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids } = posts;

        const postsList = ids?.length
            ? ids.map(postId => <Post key={postId} postId={postId}/>)
            : null

        content = (
            <div className="cateContainer">
                <Container fluid maxWidth="lg">
                    <BreadCrumbs />
                    {postsList}
                </Container>
            </div>
        )
    } else if (isError){
        <p>{error}</p>
    }

    return content;
}
