import './post.css';
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
    return (
        <div className="postContainer">
            <Paper elevation={2} square >
                <Grid container>
                    <Grid item xs={12} sm={5} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'start' }, alignItems: 'center' }}>
                        {post ?
                            <img className="postThumbnail"
                                src={post.thumbnail}
                                alt={post.slug} />
                            :
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                className="postThumbnail"
                                height={Math.floor(Math.random() * (250 - 214 + 1)) + 214}
                                width="100%"
                            />
                        }

                    </Grid>
                    <Grid item xs={12} sm={7} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                        {post ?
                            <Box p={3}>
                                <Link to={`/post/${post.slug}`} className="postTitle">{post.title}</Link>
                                <p className="postSummary">{post.description}</p>
                                <Link to={`/post/${post.slug}`}>
                                    <button className="readmoreButton">Đọc tiếp</button>
                                </Link>
                            </Box>
                            :
                            <Box p={3} width={'100%'}>
                                <Typography component="div" variant={'h4'}><Skeleton /></Typography>
                                <Typography component="div" variant={'h4'}><Skeleton width="20%" /></Typography>
                                <Typography component="div" variant={'caption'}><Skeleton /></Typography>
                                <Typography component="div" variant={'caption'}><Skeleton width="90%" /></Typography>
                                <button disabled className="readmoreButton">Đọc tiếp</button>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}
