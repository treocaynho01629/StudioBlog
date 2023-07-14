import './category.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Category() {
    const {cate} = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get(`/posts`);
            setPosts(res.data);
        }
        fetchPosts();
    }, []);

    return (
        <div className="cateContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs />
                {posts.map((post) => (
                    <Post post={post} />
                ))}
            </Container>
        </div>
    )
}
