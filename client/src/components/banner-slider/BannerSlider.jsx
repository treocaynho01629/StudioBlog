import './bannerslider.css';
import Slider from 'react-slick';

const settings = {
    infinite: true,
    fade: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

export default function BannerSlider() {
    const banners = [
        {image: require('../../assets/Banner-2.jpg')},
        {image: require('../../assets/Banner-2.jpg')},
    ]

    return (
        <div className="bannerSliderContainer">
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <div key={index} className="bannerSliderWrapper">
                        <img className="bannerImage"
                            src={banner.image}
                            alt={`banner-${index}`}
                            loading="lazy" />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
