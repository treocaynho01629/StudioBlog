import './comment.css';
import { Box, CircularProgress } from '@mui/material';
import { CalendarMonth, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { useDeleteCommentMutation } from '../../features/comments/commentsApiSlice';
import useAuth from '../../hooks/useAuth';

export default function Comment({ comment }) {
    const { isAdmin } = useAuth();
    const [deleteComment, {
        isLoading,
        isSuccess,
        isError,
        error,
    }] = useDeleteCommentMutation();

    const onDeleteClicked = async () => {
        await deleteComment({ id: comment?.id });
    }

    if (comment){
        const date = new Date(comment.createdAt);

        return (
            <div className="commentContainer">
                <div className="commentInfo">
                    <Box className="leftInfo" display="flex" alignItems="center">
                        <div className="info">
                            <PersonIcon sx={{ marginRight: 1 }} />
                            {comment.fullName}
                        </div>
                        <div className="info">
                            <CalendarMonth sx={{ marginRight: 1 }} />
                            Đăng vào lúc: { date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()}
                        </div>
                    </Box>
                    { isAdmin &&
                        <Box className="rightInfo" display="flex" alignItems="center">
                            <button className="deleteButton" 
                            disabled={isLoading}
                            onClick={onDeleteClicked}>
                                <DeleteIcon sx={{ marginRight: 1 }} />Xoá
                                {isLoading && (
                                <CircularProgress
                                    size={22}
                                    sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                    }}
                                />
                                )}
                            </button>
                        </Box>
                    }
                </div>
                <p className="commentContent">
                    {comment.content}
                </p>
            </div>
        )
    }
}
