import React from 'react'
import { Link } from 'react-router-dom'

export default function Review({ review }) {
  return (
    <Link to={review.url}>
        <div className="reviewContainer">
            <div>
                <img src={review.avatar}/>
                <p>{review.author}</p>
            </div>
            <div>{review.rating} : {review.time}</div>
            <p>{review.content}</p>
        </div>
    </Link>
  )
}
