import './manage.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs'
import { Container, Grid, Paper } from '@mui/material'
import { Book as BlogIcon, Groups as UsersIcon, BurstMode as ImagesIcon, Category as CategoriesIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

export default function Manage() {
    const { isAdmin } = useAuth();
    useTitle(`Quản lý - TAM PRODUCTION`);

    return (
        <div className="manageContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={'Quản lý'} />
                <h1 className="alternativeTitle">QUẢN LÝ</h1>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Link to="/posts-list">
                            <Paper square elevation={2} className="tabButton" sx={{ borderColor: '#0f3e3c', color: '#0f3e3c' }}>
                                <BlogIcon sx={{ fontSize: 40, marginRight: 1 }} />Bài viết
                            </Paper>
                        </Link>
                    </Grid>
                    { isAdmin ?
                    <>
                        <Grid item xs={12} sm={6}>
                            <Link to="/users-list">
                                <Paper square elevation={2} className="tabButton" sx={{ borderColor: '#b9c951', color: '#b9c951' }}>
                                    <UsersIcon sx={{ fontSize: 40, marginRight: 1 }} />Người dùng
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/images-list">
                                <Paper square elevation={2} className="tabButton" sx={{ borderColor: '#51b7c9', color: '#51b7c9' }}>
                                    <ImagesIcon sx={{ fontSize: 40, marginRight: 1 }} />Kho ảnh
                                </Paper>
                            </Link>
                        </Grid>
                    </>
                    : null }
                </Grid>
            </Container>
        </div>
    )
}
