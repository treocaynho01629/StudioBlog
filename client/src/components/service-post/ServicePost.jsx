import './servicepost.css';
import { Link } from 'react-router-dom';

export default function ServicePost({post}) {
  const PF = "http://localhost:5000/images/"

  return (
    <Link className="link" to={`/post/${post._id}`}>
      <div className="servicePostContainer">
          <img loading="lazy" className="servicePostImage" alt="post" src={PF + post.thumbnail} />
          <div className="servicePostTitle">{post.title}</div>
      </div>
    </Link>
  )
}
