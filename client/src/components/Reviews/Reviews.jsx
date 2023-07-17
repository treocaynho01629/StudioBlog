import './reviews.css';
import Review from '../review/Review';
import Slider from 'react-slick';

const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 0,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                lazyLoad: true,
            }
        }
    ]
};

export default function Reviews({ reviews }) {
  return (
    <div className="reviews">
        <Slider {...settings}>
            {reviews.map((review) => (
                <Review review={review} />
            ))}
        </Slider>
    </div>
  )
}
