import './home.css'
import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import { Lightbulb, AttachMoney, HelpCenter, ArrowRight } from '@mui/icons-material';
import ServicePosts from '../../components/service-posts/ServicePosts';
import BannerSlider from '../../components/banner-slider/BannerSlider';
import YoutubeEmbed from '../../components/youtube-embed/YoutubeEmbed';
import useFetch from '../../hooks/useFetch';
import Reviews from '../../components/Reviews/Reviews';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [reviews, setReviews] = useState([]);
    const { data, isLoading } = useFetch("/posts");
    const { data: dataVideo, isLoading: loadingVideo } = useFetch("/videos");
    const { data: dataReview, isLoading: loadingReview } = useFetch("/reviews");

    useEffect(() => {
        if (!isLoading && data){
            setPosts(data);
        }
    }, [data])

    useEffect(() => {
        if (!loadingVideo && dataVideo){
            setVideos(dataVideo);
        }
    }, [dataVideo])

    useEffect(() => {
        if (!loadingReview && dataReview){
            setReviews(dataReview);
        }
    }, [dataReview])

    return (
        <div className="homeContainer">
            <BannerSlider/>
            <Container fluid maxWidth="lg">
                <div className="box">
                    <h1 className="mainTitle">DỊCH VỤ NỔI BẬT</h1>
                    <ServicePosts posts={posts}/>
                </div>
            </Container>
            <div className="alterBox">
                <Container fluid maxWidth="lg">
                    <div className="videoContainer">
                        <h1 className="mainTitle">SẢN PHẨM NỔI BẬT</h1>
                    {videos.map((video) => (
                        <YoutubeEmbed video={video} />
                    ))}
                    </div>
                </Container>
            </div>
            <Container fluid maxWidth="lg">
                <div className="box">
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <img className="aboutImage"
                            loading="lazy"
                            src="https://tamproduction.com/wp-content/uploads/2023/06/Untitled-3-copy.png"/>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <h1 className="aboutMainTitle">VỀ TAM PRODUCTION</h1>
                            <div className="aboutTab">
                                <Lightbulb className="aboutIcon" sx={{fontSize: 50}}/>
                                <div className="aboutInfo">
                                    <p className="aboutTitle">Ý TƯỞNG SÁNG TẠO</p>
                                    <p className="aboutContent">
                                        Chúng tôi luôn mang lại cho Khách hàng những ý tưởng mới cho những sự kiện. Giúp khách hàng lưu lại những kỷ niệm đáng nhớ của cuộc đời
                                    </p>
                                </div>
                            </div>
                            <div className="aboutTab">
                                <AttachMoney className="aboutIcon" sx={{fontSize: 50}}/>
                                <div className="aboutInfo">
                                    <p className="aboutTitle">CHI PHÍ HỢP LÝ</p>
                                    <p className="aboutContent">
                                        Chúng tôi mang lại cho khách hàng những sự kiện tuyệt vời với chi phí hợp lý. Giá cả cạnh tranh với những đối thủ trên thị trường hiện nay
                                    </p>
                                </div>
                            </div>
                            <div className="aboutTab">
                                <HelpCenter className="aboutIcon" sx={{fontSize: 50}}/>
                                <div className="aboutInfo">
                                    <p className="aboutTitle">HỖ TRỢ NHIỆT TÌNH</p>
                                    <p className="aboutContent">
                                        Chúng tôi luôn sẵn sàng hỗ trợ khách hàng trong mọi trường hợp, nếu có bất kỳ vấn đề gì cần xử lý, bạn hãy liên hệ với hotline của chúng tôi
                                    </p>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            <div className="alterBox">
                <Container fluid maxWidth="lg">
                    <div className="reviewContainer">
                        <h1 className="mainTitle">PHẢN HỒI KHÁCH HÀNG</h1>
                        <Reviews reviews={reviews}/>
                    </div>
                </Container>
            </div>
            <div className="contactTab">
                <h3 className="contactTitle">Đăng ký nhận báo giá các gói dịch vụ của chúng tôi!</h3>
                <button className="contactButton">Liên hệ ngay<ArrowRight/></button>
            </div>
        </div>
    )
}
