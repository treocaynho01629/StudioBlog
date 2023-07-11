import './home.css'
import Carousel from 'react-grid-carousel'
import ServicePost from '../../components/service-post/ServicePost'

export default function Home() {
  return (
    <div className="homeContainer">
        Home
        <div className="serviceContainer">
            <h1>DỊCH VỤ NỔI BẬT</h1>
            <Carousel cols={3} rows={2} gap={15} mobileBreakpoint={412} hideArrow dot loop responsiveLayout={[{
                breakpoint: 900,
                cols: 1,
                rows: 1,
                loop: true,
                showDots: true,
                autoplay: 10000
            }]}>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            <Carousel.Item>
                <ServicePost/>
            </Carousel.Item>
            </Carousel>
        </div>
    </div>
  )
}
