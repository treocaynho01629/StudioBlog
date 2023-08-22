import './home.css'
import { Container, Grid } from '@mui/material';
import { Lightbulb, AttachMoney, HelpCenter, ArrowRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ServicePosts from '../../components/service-posts/ServicePosts';
import BannerSlider from '../../components/banner-slider/BannerSlider';
import YoutubeList from '../../components/youtube-list/YoutubeList';
import Reviews from '../../components/reviews/Reviews';
import useTitle from '../../hooks/useTitle';

export default function Home() {
    useTitle("TAM PRODUCTION");

    return (
        <div className="homeContainer">
            <BannerSlider/>
            <Container fluid maxWidth="lg">
                <div className="box">
                    <h1 className="mainTitle">DỊCH VỤ NỔI BẬT</h1>
                    <ServicePosts/>
                </div>
            </Container>
            <div className="alterBox">
                <Container fluid maxWidth="lg">
                    <div className="vidContainer">
                        <h1 className="mainTitle">SẢN PHẨM NỔI BẬT</h1>
                        <YoutubeList/>
                    </div>
                </Container>
            </div>
            <Container fluid maxWidth="lg">
                <div className="box">
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <img className="aboutImage"
                            loading="lazy"
                            src={require(`../../assets/Untitled-3-copy.png`)}
                            />
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
                        <Reviews/>
                    </div>
                </Container>
            </div>
            <div className="contactTab">
                <h3 className="contactTitle">Đăng ký nhận báo giá các gói dịch vụ của chúng tôi!</h3>
                <Link to="/contact"><button className="contactButton">Liên hệ ngay<ArrowRight/></button></Link>
            </div>
        </div>
    )
}
