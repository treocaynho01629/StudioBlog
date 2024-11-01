import './navbar.css'
import { AppBar, Grid, Typography, Container, Menu, MenuItem, ListItemIcon, Skeleton, useMediaQuery } from '@mui/material'
import { Phone as PhoneIcon, Mail as MailIcon, Menu as MenuIcon, Logout, Speed, Portrait, Person, ManageAccounts } from '@mui/icons-material'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Suspense, useEffect, useState, lazy } from 'react';
import { useSignoutMutation } from '../../features/auth/authApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { setPersist } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';

const NavDrawer = lazy(() => import("./NavDrawer"));
const Pending = lazy(() => import("../layout/Pending"));

const tabs = [{
    name: 'TRANG CHỦ',
    url: '/'
},
{
    name: 'GIỚI THIỆU',
    url: '/about'
},
{
    name: 'VIDEO',
    url: '/videos'
}]

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
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [signout, { isLoading: signingOut, isSuccess: loggedOut }] = useSignoutMutation();
    const { data: categories, isLoading, isSuccess } = useGetCategoriesQuery();
    const mobileMode = useMediaQuery('(max-width:768px)');
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedOut) {
            navigate('/')
        }
    }, [loggedOut, navigate])

    const toggleDrawer = (open) => (e) => {
        setOpenDrawer(open);
    };

    const handleNavigate = (url) => (e) => {
        navigate(url);
        setOpenDrawer(false);
    }

    const handleSignout = () => {
        dispatch(setPersist(false));
        signout();
    }

    const handleClick = (event) => {
        username ? setAnchorEl(event.currentTarget) : navigate('/login');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let catesList;
    if (isLoading) {
        catesList = <Typography component="div" variant={'body1'} marginX={2}><Skeleton width="90px" /></Typography>
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesList = ids?.length
            ? ids?.map(cateId => {
                const cate = entities[cateId];

                return (
                    <li className="tab" key={cateId}>
                        <NavLink className="link" to={`/category/${cate.type}`}>{cate.name}</NavLink>
                    </li>
                )
            })
            : null
    }

    return (
        <>
            {mobileMode ?
                <Suspense fallback={null}>
                    <NavDrawer {...{
                        openDrawer, toggleDrawer, handleNavigate, isLoading, isSuccess, categories,
                        tabs, username, isAdmin, signingOut, handleSignout
                    }} />
                </Suspense>
                :
                <div className="top">
                    <Container fluid maxWidth="lg">
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
                    </Container>
                </div>
            }
            <AppBar sx={{ backgroundColor: 'white' }} position="sticky" top={-0.5}>
                <Container fluid maxWidth="lg">
                    <div className="bottom">
                        <div className="bottomLeft">
                            <Link to="/">
                                <img className="logoImage" alt="logo" src={require(`../../assets/logo.png`)} />
                            </Link>
                        </div>
                        {!mobileMode &&
                            <>
                                <div className="bottomCenter">
                                    <ul className="tabList">
                                        {tabs.map((tab) => (
                                            <li className="tab" key={tab.name}><NavLink className="link" to={tab.url}>{tab.name}</NavLink></li>
                                        ))}
                                        {catesList}
                                        <li className="tab"><NavLink className="link" to="/contact">LIÊN HỆ</NavLink></li>
                                    </ul>
                                </div>
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
                                    <MenuItem>
                                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItemIcon>
                                                <Portrait fontSize="small" />
                                            </ListItemIcon>
                                            Hồ sơ
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to="/manage" style={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItemIcon>
                                                <Speed fontSize="small" />
                                            </ListItemIcon>
                                            Quản lý
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleSignout} disabled={signingOut}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        {signingOut ? 'Đang đăng xuất' : 'Đăng xuất'}
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                        <div className="bottomRight">
                            <button className="drawerButton" onClick={toggleDrawer(true)}>
                                <MenuIcon sx={{ fontSize: 26 }} />
                            </button>
                            <button className="signUpButton" onClick={handleClick}>
                                <p>{username ? username : 'Đăng nhập'}</p>
                                {isAdmin ? <ManageAccounts sx={{ fontSize: 26, marginLeft: 1 }} />
                                    : <Person sx={{ fontSize: 26, marginLeft: 1 }} />}
                            </button>
                        </div>
                    </div>
                </Container>
            </AppBar>
            {signingOut && <Suspense fallback={null}><Pending open={signingOut} message={'Đang đăng xuất...'} /></Suspense>}
        </>
    )
}
