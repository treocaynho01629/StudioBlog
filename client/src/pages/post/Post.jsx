import './post.css'
import PostDetail from '../../components/post-detail/PostDetail'
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import { Container } from '@mui/material'
import Comments from '../../components/comments/Comments'

export default function Post() {
  return (
    <div className="postContainer">
      <Container fluid maxWidth="lg">
        <BreadCrumbs/>
        <PostDetail/>
        <Comments/>
      </Container>
    </div>
  )
}
