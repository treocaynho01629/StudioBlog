import './servicepost.css';
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
  }
}
