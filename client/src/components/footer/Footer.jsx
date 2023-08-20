import { Link } from 'react-router-dom'
import './footer.css'
import { Container, Grid } from '@mui/material'

export default function Footer() {
  return (
    <div className="footerContainer">
        <Container fluid maxWidth="lg">
            <p className="footerTop">
                LIÊN HỆ CHÚNG TÔI TẠI
            </p>
            <Grid container>
                <Grid item xs={12} sm={8} md={6}>
                    <div className="footerLeft">
                        <Link to="/">
                            <div className="footerFullLogo">
                                <img className="footerFullLogoImage" alt="logo" src={require(`../../assets/logo.png`)}/>
                                <div className="footerLogoText">AM 
                                    <div className="footerLogoTextAlt">
                                        <span className="footerLogoTextSmall">PRODUCTION</span>
                                        <span className="footerLogoInfo">WEEDING-EVENT-TVC-LIVESTREAM</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        
                        <ul className="footerInfoList">
                            <li className="footerInfo"><b>Địa chỉ:</b> 217/24/12 Ngô Quyền, Phường 6, Tp Đà Lạt</li>
                            <li className="footerInfo"><b>Hotline:</b> 0908747742 (Mr Tâm)</li>
                            <li className="footerInfo"><b>Email:</b> tamproduction102@gmail.com</li>
                            <li className="footerInfo">Chụp ảnh Đà Lạt, quay phim Đà Lạt</li>
                        </ul>
                    </div>
                    
                </Grid>
                <Grid item xs={12} sm={4} md={6} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                    <div className="footerMap">
                        <iframe title="map"
                            className="mapFrame"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.246518852702!2d108.4266311!3d11.9574266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317113b07111e0b3%3A0x4d7fb786e7ac7e20!2zUXVheSBwaGltIMSQw6AgTOG6oXQgVEFNIFBST0RVQ1RJT04!5e0!3m2!1svi!2s!4v1686801166420!5m2!1svi!2s" 
                            width="100%" 
                            height="200" 
                            style={{border: '0px'}}
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </Grid>
            </Grid>
        </Container>
    </div>
  )
}
