import './reviews.css';
import Review from '../review/Review';
import Slider from 'react-slick';
import { useGetReviewsQuery } from '../../features/google/googleApiSlice';

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

export default function Reviews() {
    const { data: reviews, isLoading, isSuccess, isError, error } = useGetReviewsQuery();

    let content;

    if (isLoading) {
        content = <p>Loading ...</p>
    } else if (isSuccess) {
        const reviewsList = (reviews && reviews?.length !== 0)
            ? reviews?.map((review, index) => (
                <Review key={index} review={review} />
            ))
            : <p>Skeleton</p>

        content = (
            <div className="reviews">
                <Slider {...settings}>
                {reviewsList}
                </Slider>
            </div>
        )
    } else if (isError){
        content = <p>{error}</p>
    }

    return content;
}
