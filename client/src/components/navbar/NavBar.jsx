import './navbar.css'
import { AppBar, Stack, Grid, Collapse, useScrollTrigger, Typography, Container, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { Phone as PhoneIcon, Mail as MailIcon, Menu as MenuIcon, Logout, AddCircleOutline, Person } from '@mui/icons-material'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSignoutMutation } from '../../features/auth/authApiSlice';
import useAuth from '../../hooks/useAuth';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import usePersist from '../../hooks/usePersist';
import { setPersist } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

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
    const { username, isAdmin } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const persist = usePersist();
    const [signout, { isSuccess: loggedOut }] = useSignoutMutation();
    const { data: categories, isLoading, isSuccess } = useGetCategoriesQuery();
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedOut) {
            navigate('/')
        }
    }, [loggedOut, navigate])

    const handleSignout = () => {
        console.log('da');
        dispatch(setPersist(false));
        signout();
    }

    const handleNewPost = () => {
        navigate('/new-post');
    }

    const handleClick = (event) => {
        username ? setAnchorEl(event.currentTarget) : navigate('/login');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let catesList;

    if (isLoading) {
        catesList = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesList = ids?.length
            ? ids?.map(cateId => {
                const cate = entities[cateId];

                return (
                <li className="tab" key={cateId}>
                    <NavLink className="link" to={`/category/${cate.type}`}>{cate.name}</NavLink>
                </li>
            )})
            : null
    } 

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
                                <Link to="/">
                                    <img className="logoImage" alt="logo" src={require(`../../assets/logo.png`)} />
                                </Link>
                            </div>
                            <div className="bottomCenter">
                                <ul className="tabList">
                                    <li className="tab"><NavLink className="link" to="/">TRANG CHỦ</NavLink></li>
                                    <li className="tab"><NavLink className="link" to="/about">GIỚI THIỆU</NavLink></li>
                                    <li className="tab"><NavLink className="link" to="/videos">VIDEO</NavLink></li>
                                    {catesList}
                                    <li className="tab"><NavLink className="link" to="/contact">LIÊN HỆ</NavLink></li>
                                </ul>
                            </div>
                            <div className="bottomRight">
                                <button className="drawerButton">
                                    <MenuIcon sx={{ fontSize: 26 }} />
                                </button>
                                <button className="signUpButton" onClick={handleClick}>
                                    { username ? username : 'Đăng nhập' }
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
                                    <MenuItem onClick={handleSignout}>
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
