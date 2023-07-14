import './home.css'
import { useEffect, useState } from 'react'
import { Container } from '@mui/material';
import axios from 'axios'
import ServicePosts from '../../components/service-posts/ServicePosts';

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("/posts");
            setPosts(res.data);
        }
        fetchPosts();
    }, [])

    return (
        <div className="homeContainer">
            <Container fluid maxWidth="lg">
                <div className="serviceContainer">
                    <h1>DỊCH VỤ NỔI BẬT</h1>
                </div>
                <ServicePosts posts={posts}/>
            </Container>
        </div>
    )
}
