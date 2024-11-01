import './review.css';
import { Rating, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom'

export default function Review({ review }) {
  if (review) {
    return (
      <Link to={review.url} style={{ textDecoration: 'none', height: '100%' }}>
        <div className="reviewsContainer">
          <span className="reviewContent">{review.content}</span>
          <div className="reviewAuthor">
            <img className="authorAvatar"
              src={review.avatar}
              alt={`${review.author}-avatar`}
              loading="lazy" />
            <span className="authorName">
              {review.author}
              <div className="reviewInfo">
                <Rating size="small" value={+review.rating} readOnly sx={{ marginRight: '10px' }} />
                {review.time}
              </div>
            </span>
          </div>
        </div>
      </Link>
    )
  } else {
    return (
      <div className="reviewsContainer">
        <span className="reviewContent">
          <Typography component="div" variant={'body1'}><Skeleton /></Typography>
          <Typography component="div" variant={'body1'}><Skeleton width="60%" /></Typography>
        </span>
        <div className="reviewAuthor">
          <Skeleton variant="circular" width={62} height={62} />
          <span className="authorName">
            <Typography component="div" variant={'body1'}><Skeleton width="120px" /></Typography>
            <div className="reviewInfo">
              <Rating size="small" value={0} readOnly sx={{ marginRight: '10px' }} />
              <Typography component="div" variant={'caption'}><Skeleton width="120px" /></Typography>
            </div>
          </span>
        </div>
      </div>
    )
  }
}
