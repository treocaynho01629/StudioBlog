import './posttab.css';
import { Box, CircularProgress, Paper, Skeleton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useDeletePostMutation } from '../../features/posts/postsApiSlice';
import useConfirm from '../../hooks/useConfirm';

export default function PostTab({ post }) {
    const { id, isAdmin } = useAuth();
    const [deletePost, { isLoading }] = useDeletePostMutation();
    const [ConfirmationDialog, confirmDelete] = useConfirm(
        'Xoá bài viết?',
        'Bạn có muốn xoá bài viết này?',
    )

    const onDeleteClicked = async () => {
        const confirmation = await confirmDelete()
        if (confirmation) {
            await deletePost({ id: post?.id })
        } else {
            console.log('cancel delete');
        }
    }

    return (
        <Paper elevation={2} square className="postContainer">
            <div className="postInfo">
                { post ?
                <Link to={`/post/${post.slug}`}><h3>{post.title}</h3></Link>
                :
                <Typography component="div" variant={'h4'}><Skeleton width="40%" /></Typography>
                }
                <p className="postLine"><b>Danh mục:&nbsp;</b>
                    {post ?
                        post.category
                        :
                        <Typography variant={'body1'}><Skeleton width="120px" /></Typography>
                    }
                </p>
                <p className="postLine"><b>Id người viết:&nbsp;</b>
                    {post ?
                        post.user
                        :
                        <Typography variant={'body1'}><Skeleton width="200px" /></Typography>
                    }
                </p>
            </div>
            <Box display="flex" justifyContent="space-between" sx={{ padding: '0px 5px' }}>
                <p className="postLine" style={{ marginTop: 0 }}><b>Sửa đổi lần cuối:&nbsp;</b>
                    {post ?
                        new Date(post.updatedAt).toLocaleDateString()
                        :
                        <Typography variant={'body1'}><Skeleton width="120px" /></Typography>
                    }
                </p>
                {post ?
                    ((isAdmin || post.user == id) ?
                        <div className="postAction">
                            <Link to={`/edit-post/${post.slug}`}>
                                <button className="postInfoButton" style={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
                                    <EditIcon />
                                </button>
                            </Link>
                            <button className="postInfoButton"
                                style={{ color: '#f25a5a', borderColor: '#f25a5a' }}
                                disabled={isLoading}
                                onClick={onDeleteClicked}>
                                <DeleteIcon />
                                {isLoading && (
                                    <CircularProgress
                                        size={22}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-11px',
                                            marginLeft: '-11px',
                                        }}
                                    />
                                )}
                            </button>
                        </div>
                        : null
                    )
                    :
                    <div className="postAction">
                        <button className="postInfoButton" disabled><EditIcon /></button>
                        <button className="postInfoButton" disabled><DeleteIcon /></button>
                    </div>
                }
            </Box>
            <ConfirmationDialog />
        </Paper>
    )
}
