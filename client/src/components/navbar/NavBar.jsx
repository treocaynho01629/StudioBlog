import { AppBar, Stack, Grid, Collapse, useScrollTrigger, Typography, Container } from '@mui/material'
import { Phone as PhoneIcon, Mail as MailIcon, Menu as MenuIcon } from '@mui/icons-material'
import './navbar.css'
import { Link } from 'react-router-dom';

function HideOnScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    return (
      <Collapse className={"top-header"} 
      in={!trigger}>
        {children}
      </Collapse>
    );
}

export default function NavBar(props) {
  return (
    <div className="navContainer">
        <AppBar sx={{backgroundColor: 'white'}} position="fixed">
            <Container fluid maxWidth="lg">
                <Stack sx={{width: '100%'}}>
                    <HideOnScroll {...props}>
                        <div className="top">
                            <Grid container>
                                <Grid item xs={12} md={6}>
                                    <div className="topLeft">
                                        <div className="contact"><PhoneIcon sx={{fontSize: 14, marginRight: '5px'}}/>0908747742</div>
                                        <div className="contact"><MailIcon sx={{fontSize: 14, marginRight: '5px'}}/> tamproduction102@gmail.com</div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className="topRight">
                                        <div className="contact">
                                            <Typography className="description">TAM PRODUCTION – Cung cấp dịch vụ quay phim, chụp ảnh chuyên nghiệp tại Đà Lạt</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </HideOnScroll>
                    <div className="bottom">
                        <div className="bottomLeft">
                            <img className="logoImage" alt="logo" src="https://tamproduction.com/wp-content/uploads/2023/06/Untitled-1-copy.png"/>
                        </div>
                        <div className="bottomCenter">
                            <ul className="tabList">
                                <li className="tab"><Link className="link" to="/">TRANG CHỦ</Link></li>
                                <li className="tab"><Link className="link" to="/">GIỚI THIỆU</Link></li>
                                <li className="tab"><Link className="link" to="/">DỊCH VỤ</Link></li>
                                <li className="tab"><Link className="link" to="/new-post">VIDEO</Link></li>
                                <li className="tab"><Link className="link" to="/post/1">TIN TỨC</Link></li>
                                <li className="tab"><Link className="link" to="/login">LIÊN HỆ</Link></li>
                            </ul>
                        </div>
                        <div className="bottomRight">
                            <button className="drawerButton">
                                <MenuIcon sx={{fontSize: 26}}/>
                            </button>
                            <button className="signUpButton">
                                Đăng ký
                                <MailIcon sx={{fontSize: 26, marginLeft: 1}}/>
                            </button>
                        </div>
                    </div>
                </Stack>
            </Container>
        </AppBar>
    </div>
  )
}
