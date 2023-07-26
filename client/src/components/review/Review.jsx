import { Rating } from '@mui/material';
import './review.css';
import { Link } from 'react-router-dom'

export default function Review({ review }) {
  if (review){
    return (
      <Link to={review.url} style={{textDecoration: 'none', height: '100%'}}>
        <div className="reviewsContainer">
          <p className="reviewContent">{review.content}</p>
          <div className="reviewAuthor">
              <img className="authorAvatar"
              src={review.avatar}
              alt=""/>
              <p className="authorName">
                {review.author}
                <div className="reviewInfo">
                  <Rating size="small" value={review.rating} readOnly sx={{marginRight: '10px'}}/>
                  {review.time}
                </div>
              </p>
          </div>
        </div>
      </Link>
    )
  }
}
