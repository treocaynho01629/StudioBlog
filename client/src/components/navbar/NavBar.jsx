import './navbar.css'
import { AppBar, Stack, Grid, Collapse, useScrollTrigger, Typography, Container, Menu, MenuItem, ListItemIcon, Divider, ListItem, List, ListItemText, ListItemButton, SwipeableDrawer } from '@mui/material'
import { Phone as PhoneIcon, Mail as MailIcon, Menu as MenuIcon, Logout, Speed, Portrait, Person, ManageAccounts as AdminIcon } from '@mui/icons-material'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSignoutMutation } from '../../features/auth/authApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { setPersist } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';

const drawerWidth = 240;
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

function HideOnScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
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
    const { window } = props;
    const { username, isAdmin } = useAuth();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
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
    let catesTab;

    if (isLoading) {
        catesList = <p>Loading...</p>
        catesTab = <p>Loading...</p>
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

        catesTab = ids?.length
            ? ids?.map(cateId => {
                const cate = entities[cateId];

                return (
                    <ListItem key={cateId} disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate(`/category/${cate.type}`)}>
                            <ListItemText sx={{textTransform: 'uppercase'}} inset primary={cate.name} />
                        </ListItemButton>
                    </ListItem>
                )
            })
            : null
    }

    const container = window !== undefined ? () => window().document.body : undefined;

    const drawer = (
        <div>
            <div className="fullLogo">
                <img className="fullLogoImage" alt="logo" src={require(`../../assets/logo.png`)}/>
                <div className="logoText">AM 
                    <div className="logoTextAlt">
                        <span className="logoTextSmall">PRODUCTION</span>
                        <span className="logoInfo">WEEDING-EVENT-TVC-LIVESTREAM</span>
                    </div>
                </div>
            </div>
            <Divider />
            <List>
                {tabs.map((tab) => (
                    <ListItem key={tab.name} disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate(tab.url)}>
                            <ListItemText inset primary={tab.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {catesTab}
                <ListItem disablePadding>
                    <ListItemButton className="tabDrawer" onClick={handleNavigate('/contact')}>
                        <ListItemText inset primary={'LIÊN HỆ'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                { username ?
                <>
                    <ListItem disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate('profile')}>
                            <ListItemIcon>
                                <Portrait />
                            </ListItemIcon>
                            <ListItemText primary={'HỒ SƠ'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate('/manage')}>
                            <ListItemIcon>
                                <Speed />
                            </ListItemIcon>
                            <ListItemText primary={'QUẢN LÝ'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleSignout}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary={'ĐĂNG XUẤT'} />
                        </ListItemButton>
                    </ListItem>
                </>
                :
                <ListItem disablePadding>
                    <ListItemButton className="tabDrawer" onClick={handleNavigate('/login')}>
                        <ListItemIcon>
                            {isAdmin ? <AdminIcon /> : <Person />}
                        </ListItemIcon>
                        <ListItemText sx={{textTransform: 'uppercase'}} primary={username ? username : 'ĐĂNG NHẬP'} />
                    </ListItemButton>
                </ListItem>
                }
            </List>
        </div>
    );

    return (
        <div className="navContainer">
            <SwipeableDrawer
            container={container}
            variant="temporary"
            open={openDrawer}
            onOpen={toggleDrawer(true)}
            onClose={toggleDrawer(false)}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                display: 'block',
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                ["@media (min-width:768px)"]: { display: 'none' }
            }}
            >
                {drawer}
            </SwipeableDrawer>
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
                                    {tabs.map((tab) => (
                                        <li className="tab" key={tab.name}><NavLink className="link" to={tab.url}>{tab.name}</NavLink></li>
                                    ))}
                                    {catesList}
                                    <li className="tab"><NavLink className="link" to="/contact">LIÊN HỆ</NavLink></li>
                                </ul>
                            </div>
                            <div className="bottomRight">
                                <button className="drawerButton" onClick={toggleDrawer(true)}>
                                    <MenuIcon sx={{ fontSize: 26 }} />
                                </button>
                                <button className="signUpButton" onClick={handleClick}>
                                    <p>{username ? username : 'Đăng nhập'}</p>
                                    {isAdmin ? <AdminIcon sx={{ fontSize: 26, marginLeft: 1 }} />
                                        : <Person sx={{ fontSize: 26, marginLeft: 1 }} />}
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
