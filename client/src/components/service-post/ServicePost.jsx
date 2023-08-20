import './servicepost.css';
import { Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ServicePost({ post }) {
  if (post) {
    return (
      <Link className="link" to={`/post/${post?.slug}`}>
        <div className="servicePostContainer">
          <img loading="lazy" className="servicePostImage" alt="post" src={post?.thumbnail} />
          <div className="servicePostTitle">{post?.title}</div>
        </div>
      </Link>
    )
  } else {
    return (
      <div className="servicePostContainer">
        <Skeleton variant="rectangular" className="servicePostImage" width={'100%'} height={280} />
        <div className="servicePostTitle">
          <Skeleton sx={{ bgcolor: 'whitesmoke' }} width="60%">
            <Typography>.</Typography>
          </Skeleton>
        </div>
      </div>
    )
  }
}
