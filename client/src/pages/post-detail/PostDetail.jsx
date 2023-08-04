import './postdetail.css'
import PostContent from '../../components/post-content/PostContent'
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import Comments from '../../components/comments/Comments'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useGetPostQuery } from '../../features/posts/postsApiSlice'
import useTitle from '../../hooks/useTitle'
import { useState } from 'react'

export default function PostDetail() {
  const { slug } = useParams();
  const { data: post, isLoading, isSuccess, isError, error } = useGetPostQuery({ slug });
  const [commentsCount, setCommentsCount] = useState(0);
  useTitle(`${post?.title} - TAM PRODUCTION`);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    content = <PostContent post={post} commentsCount={commentsCount} />;
  } else if (isError) {
    content = <p>{error}</p>
  }

  return (
    <div className="postDetailContainer">
      <Container fluid maxWidth="lg">
        <BreadCrumbs post={post}/>
        {content}
        <Comments postId={post?.id} setCommentsCount={setCommentsCount} />
      </Container>
    </div>
  )
}
