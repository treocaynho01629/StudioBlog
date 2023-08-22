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

const tempReviews = [
    {
        author: 'Ny Bao',
        content: 'Ekip chuyên nghiệp từ khâu tiền kỳ đến lhi hoàn thành project, sản phẩm gửi sếp duyệt ngay. Sẽ ủng hộ trong tương lai',
        rating: '5',
        time: 'vài tháng trước',
        avatar: 'https://lh3.googleusercontent.com/a-/AD_cMMR0ggkZ1wsEVqjAUIGs1nC9sN56nyamJxPqTMu6oKMfHKVz=w36-h36-p-rp-mo-br100',
        url: 'https://www.google.com/maps/contrib/112704111795492956411/reviews?hl=vi'
    },
    {
        author: 'Quốc Bảo',
        content: 'Cảm ơn  team đã hỗ trợ rất chuyên nghiệp, rất ...lăn xả và rất nghệ thuật cho các sản phẩm của bên mình nhé!',
        rating: '5',
        time: 'vài tháng trước',
        avatar: 'https://lh3.googleusercontent.com/a-/AD_cMMSW5oQJ2CFFsVLFFp9yfdiflzOiQtMXpFX2OOHnMb6IPQ=w36-h36-p-rp-mo-br100',
        url: 'https://www.google.com/maps/contrib/115319129841732850054/reviews?hl=vi'
    },
    {
        author: 'Trần Doãn Hiệp',
        content: 'Đã từng trải nghiệm dịch vụ tại đây, rất hài lòng với chất lượng sản phẩm',
        rating: '5',
        time: 'vài tháng trước',
        avatar: 'https://lh3.googleusercontent.com/a-/AD_cMMSpqsGxPVNEGcKDkHiLpxzxKfhFflm-nf6LnrS7gEZWHHbL=w36-h36-p-rp-mo-br100',
        url: 'https://www.google.com/maps/contrib/112600762309727873352/reviews?hl=vi'
    },
    {
        author: 'Minh Hanh',
        content: 'Kiểu đội ngũ ekip chuyên nghiệp, chú đáo. Sản phẩm nhận được vượt kỳ vọng Nói chung là 10 đỉmm',
        rating: '5',
        time: 'vài tháng trước',
        avatar: 'https://lh3.googleusercontent.com/a-/AD_cMMTk378RVX697YHGgZRw6lFVvu1_2pAsCXC7bk5bWLJxq2-k=w36-h36-p-rp-mo-br100',
        url: 'https://www.google.com/maps/contrib/101347438002649578466/reviews?hl=vi'
    }
]

export default function Reviews() {
    const { data: reviews, isLoading, isSuccess, isError } = useGetReviewsQuery();

    let reviewsList;

    if (isLoading) {
        reviewsList = [...new Array(2)].map((element, index) => {
            return <Review key={index} />
        })
    } else if (isSuccess) {
        reviewsList = (reviews && reviews?.length !== 0)
            ? reviews?.map((review, index) => (
                <Review key={review.url} review={review} />
            ))
            : tempReviews.map((review, index) => (
                <Review key={review.url} review={review} />
            ))
    } else if (isError){
        reviewsList = tempReviews.map((review, index) => (
            <Review key={review.url} review={review} />
        ))
    }

    return (
        <div className="reviews">
            <Slider {...settings}>
            {reviewsList}
            </Slider>
        </div>
    )
}
