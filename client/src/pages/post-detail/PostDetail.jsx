import './postdetail.css'
import PostContent from '../../components/post-content/PostContent'
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import Comments from '../../components/comments/Comments'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

export default function PostDetail() {
  const {id} = useParams();
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data);
    };
    getPost();
  })

  return (
    <div className="postDetailContainer">
      <Container fluid maxWidth="lg">
        <BreadCrumbs/>
        <PostContent post={post}/>
        <Comments/>
      </Container>
    </div>
  )
}
