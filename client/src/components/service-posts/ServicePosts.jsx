import './serviceposts.css'
import ServicePost from '../../components/service-post/ServicePost'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery(
        { cate: 'service' }, 
        "postsList", {
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { entities } = posts;

        const postsList = entities?.length
            ? entities?.map(post => (
                <div key={post.id} className="servicePostsWrapper">
                    <ServicePost post={post}/>
                </div>
            ))
            : null

        content = (
        <div className="servicePostsContainer">
            <Slider {...settings}>
                {postsList}
            </Slider>
        </div>
        )
    } else if (isError){
        content = <p>{error}</p>
    }

    return content;
}
