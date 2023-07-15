import './serviceposts.css'
import ServicePost from '../../components/service-post/ServicePost'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 500,
    rows: 2,
    slidesPerRow: 3,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                rows: 1,
                slidesPerRow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                lazyLoad: true,
            }
        },
        {
            breakpoint: 900,
            settings: {
                rows: 1,
                slidesPerRow: 1,
                slidesToScroll: 1,
                initialSlide: 0,
                infinite: true,
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                lazyLoad: true,
            }
        }
    ]
};

export default function ServicePosts({ posts }) {
    return (
        <div className="servicePostsContainer">
            <Slider {...settings}>
                {posts.map((post) => (
                    <div className="servicePostsWrapper">
                        <ServicePost key={post.id} post={post}/>
                    </div>
                ))}
            </Slider>
        </div>
    )
}
