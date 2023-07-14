import { AppBar, Stack, Grid, Collapse, useScrollTrigger, Typography, Container, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { Phone as PhoneIcon, Mail as MailIcon, Menu as MenuIcon, Logout, AddCircleOutline, Person } from '@mui/icons-material'
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Context } from '../../context/Context';
import { useContext } from 'react';

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

const menuStyle = {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
    },
    '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
    },
}

export default function NavBar(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { auth, dispatch } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        handleClose();
        dispatch({type: "LOGOUT"});
    }

    const handleNewPost = () => {
        handleClose();
        navigate('/new-post');
    }

    const handleClick = (event) => {
        auth ? setAnchorEl(event.currentTarget) : navigate('/login');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="navContainer">
            <AppBar sx={{ backgroundColor: 'white' }} position="fixed">
                <Container fluid maxWidth="lg">
                    <Stack sx={{ width: '100%' }}>
                        <HideOnScroll {...props}>
                            <div className="top">
                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <div className="topLeft">
                                            <div className="contact"><PhoneIcon sx={{ fontSize: 14, marginRight: '5px' }} />0908747742</div>
                                            <div className="contact"><MailIcon sx={{ fontSize: 14, marginRight: '5px' }} /> tamproduction102@gmail.com</div>
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
                                <img className="logoImage" alt="logo" src="https://tamproduction.com/wp-content/uploads/2023/06/Untitled-1-copy.png" />
                            </div>
                            <div className="bottomCenter">
                                <ul className="tabList">
                                    <li className="tab"><Link className="link" to="/">TRANG CHỦ</Link></li>
                                    <li className="tab"><Link className="link" to="/">GIỚI THIỆU</Link></li>
                                    <li className="tab"><Link className="link" to="/category/service">DỊCH VỤ</Link></li>
                                    <li className="tab"><Link className="link" to="/">VIDEO</Link></li>
                                    <li className="tab"><Link className="link" to="/category/news">TIN TỨC</Link></li>
                                    <li className="tab"><Link className="link" to="/login">LIÊN HỆ</Link></li>
                                </ul>
                            </div>
                            <div className="bottomRight">
                                <button className="drawerButton">
                                    <MenuIcon sx={{ fontSize: 26 }} />
                                </button>
                                <button className="signUpButton" onClick={handleClick}>
                                    { auth ? auth.username : 'Đăng nhập' }
                                    <Person sx={{ fontSize: 26, marginLeft: 1 }} />
                                </button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: menuStyle,
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleNewPost}>
                                        <ListItemIcon>
                                            <AddCircleOutline fontSize="small" />
                                        </ListItemIcon>
                                        Thêm bài viết
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Đăng xuất
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </Stack>
                </Container>
            </AppBar>
        </div>
    )
}
