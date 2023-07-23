import './post.css';
import { Box, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
    if (post) {
        return (
            <div className="postContainer">
                <Paper elevation={2} square >
                    <Grid container>
                        <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img className="postThumbnail"
                                src={post.thumbnail}
                                alt="" />
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{display: 'flex', alignItems: 'center'}}>
                            <Box p={3}>
                                <Link to={`/post/${post.slug}`} className="postTitle">{post.title}</Link>
                                <p className="postSummary">{post.description}</p>
                                <Link to={`/post/${post.slug}`} className="postTitle">
                                    <button className="readmoreButton">Đọc tiếp</button>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )
    } else return null;
}
