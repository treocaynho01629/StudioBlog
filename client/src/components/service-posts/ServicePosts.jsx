import './serviceposts.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ServicePost from '../../components/service-post/ServicePost'
import Slider from 'react-slick';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';

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

export default function ServicePosts() {
    const { data: posts, isLoading, isSuccess, isError } = useGetPostsQuery(
        { size: 6, cate: 'service' }
    );

    let postsList;

    if (isLoading || isError) {
        postsList = [...new Array(6)].map((element, index) => {
            return (
                <div key={index} className="servicePostsWrapper">
                    <ServicePost />
                </div>
            )
        })
    } else if (isSuccess) {
        const { ids, entities } = posts;

        postsList = ids?.length
            ? ids?.map(postId => {
                const post = entities[postId];

                return (
                    <div key={post.id} className="servicePostsWrapper">
                        <ServicePost post={post} />
                    </div>
                )
            })
            : [...new Array(6)].map((element, index) => {
                return (
                    <div key={index} className="servicePostsWrapper">
                        <ServicePost />
                    </div>
                )
            })
    }

    return (
        <div className="servicePostsContainer">
            <Slider {...settings}>
                {postsList}
            </Slider>
        </div>
    )
}
