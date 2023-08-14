import './posttab.css';
import { Box, CircularProgress, Paper } from '@mui/material';
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

    if (post) {
        return (
            <Paper elevation={2} square className="postContainer">
                <div className="postInfo">
                    <Link to={`/post/${post.slug}`}>
                        <h3>{post.title}</h3>
                    </Link>
                    <p><b>Danh mục: </b>{post.category}</p>
                    <p><b>Id người viết: </b>{post.user}</p>
                </div>
                <Box display="flex" justifyContent="space-between" sx={{padding: '0px 5px'}}>
                    <p style={{marginTop: 0}}><b>Sửa đổi lần cuối: </b>{new Date(post.updatedAt).toLocaleDateString()}</p>
                    { (isAdmin || post.user == id) ?
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
                    }
                </Box>
                <ConfirmationDialog/>
            </Paper>
        )
    } else return null;
}
