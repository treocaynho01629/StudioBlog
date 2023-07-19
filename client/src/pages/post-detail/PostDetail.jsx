import './postdetail.css'
import PostContent from '../../components/post-content/PostContent'
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import Comments from '../../components/comments/Comments'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useGetPostQuery } from '../../features/posts/postsApiSlice'

export default function PostDetail() {
  const { slug } = useParams();
  const { data: post, isLoading, isSuccess, isError, error } = useGetPostQuery({ slug });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    content = <PostContent post={post} />;
  } else if (isError) {
    content = <p>{error}</p>
  }

  return (
    <div className="postDetailContainer">
      <Container fluid maxWidth="lg">
        <BreadCrumbs />
        {content}
        <Comments />
      </Container>
    </div>
  )
}
