import './postdetail.css'
import PostContent from '../../components/post-content/PostContent'
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import Comments from '../../components/comments/Comments'
import useTitle from '../../hooks/useTitle'
import { Container } from '@mui/material'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useGetPostQuery } from '../../features/posts/postsApiSlice'
import { useEffect, useState } from 'react'

export default function PostDetail() {
  const { slug } = useParams();
  const { data: post, isLoading, isSuccess, isError } = useGetPostQuery({ slug }, {
    refetchOnMountOrArgChange: true
  });
  const [commentsCount, setCommentsCount] = useState(0);
  const navigate = useNavigate();
  useTitle(`${post?.title || 'Bài viết'} - TAM PRODUCTION`);

  console.log(isSuccess);

  useEffect(() => {
    if (isError && !isLoading) navigate("/error");
  }, [isError])

  let content;
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    content = <PostContent post={post} commentsCount={commentsCount} />
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
