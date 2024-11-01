import './navbar.css'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, SwipeableDrawer, Typography } from '@mui/material';
import { Logout, ManageAccounts, Person, Portrait, Speed } from '@mui/icons-material';

const drawerWidth = 300;

const NavDrawer = ({ openDrawer, toggleDrawer, handleNavigate, isLoading, isSuccess, categories, 
    tabs, username, isAdmin, signingOut, handleSignout }) => {
    let catesTab;

    if (isLoading) {
        catesTab = (
            <ListItem disablePadding>
                <ListItemButton className="tabDrawer">
                    <ListItemText inset>
                        <Typography component="div" variant={'body1'}><Skeleton width="90px" /></Typography>
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        )
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesTab = ids?.length
            ? ids?.map(cateId => {
                const cate = entities[cateId];

                return (
                    <ListItem key={cateId} disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate(`/category/${cate.type}`)}>
                            <ListItemText sx={{ textTransform: 'uppercase' }} inset primary={cate.name} />
                        </ListItemButton>
                    </ListItem>
                )
            })
            : null
    }

    const drawer = (
        <div>
            <div className="fullLogo">
                <img className="fullLogoImage" alt="logo" src={require(`../../assets/logo.png`)} />
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
                {username ?
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
                            <ListItemButton className="tabDrawer" onClick={handleSignout} disabled={signingOut}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary={signingOut ? 'ĐANG ĐĂNG XUẤT' : 'ĐĂNG XUẤT'} />
                            </ListItemButton>
                        </ListItem>
                    </>
                    :
                    <ListItem disablePadding>
                        <ListItemButton className="tabDrawer" onClick={handleNavigate('/login')}>
                            <ListItemIcon>
                                {isAdmin ? <ManageAccounts /> : <Person />}
                            </ListItemIcon>
                            <ListItemText sx={{ textTransform: 'uppercase' }} primary={username ? username : 'ĐĂNG NHẬP'} />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
        </div>
    );

    return (
        <SwipeableDrawer
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
    )
}

export default NavDrawer