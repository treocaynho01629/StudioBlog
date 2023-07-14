import './serviceposts.css'
import Carousel from 'react-grid-carousel'
import ServicePost from '../../components/service-post/ServicePost'

export default function ServicePosts({posts}) {
  return (
    <div className="servicePostsContainer">
        <Carousel cols={3} rows={2} gap={15} mobileBreakpoint={412} hideArrow loop responsiveLayout={[{
            breakpoint: 900,
            cols: 1,
            rows: 1,
            loop: true,
            showDots: true,
            autoplay: 10000
        }]}>
            {posts.map((post) => (
                <Carousel.Item>
                    <ServicePost key={post.id} post={post}/>
                </Carousel.Item>
            ))}
        </Carousel>
    </div>
  )
}
