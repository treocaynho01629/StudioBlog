import './comment.css';
import { CircularProgress, Grid } from '@mui/material';
import { CalendarMonth, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { useDeleteCommentMutation } from '../../features/comments/commentsApiSlice';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';

export default function Comment({ comment, reloadComments }) {
    const { isAdmin } = useAuth();
    const [deleteComment, { isLoading }] = useDeleteCommentMutation();
    const [ConfirmationDialog, confirmDelete] = useConfirm(
        'Xoá ý kiến?',
        'Bạn có muốn xoá ý kiến này?',
    )

    const onDeleteClicked = async () => {
        const confirmation = await confirmDelete();
        if (confirmation) {
            reloadComments();
            await deleteComment({ id: comment?.id });
        } else {
            console.log('cancel delete');
        }
    }

    if (comment) {
        const date = new Date(comment.createdAt);

        return (
            <div className="commentContainer">
                <Grid container className="commentInfo">
                    <Grid item className="leftInfo" display="flex" alignItems="center">
                        <div className="info">
                            <PersonIcon sx={{ marginRight: 1 }} />
                            {comment.fullName}
                        </div>
                        <div className="info">
                            <CalendarMonth sx={{ marginRight: 1 }} />
                            Đăng vào lúc: {date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()}
                        </div>
                    </Grid>
                    {isAdmin &&
                        <Grid item className="rightInfo" display="flex" alignItems="center">
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
                        </Grid>
                    }
                </Grid>
                <p className="commentContent">
                    {comment.content}
                </p>
                <ConfirmationDialog/>
            </div>
        )
    }
}
