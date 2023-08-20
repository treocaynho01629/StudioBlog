import './comment.css';
import { CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
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

    const date = new Date(comment?.createdAt);

    return (
        <div className="commentContainer">
            <Grid container className="commentInfo">
                <Grid item className="leftInfo" display="flex" alignItems="center">
                    <div className="info">
                        <PersonIcon sx={{ marginRight: 1 }} />
                        { comment ? 
                        comment.fullName
                        :
                        <Typography component="div" variant={'body1'} marginLeft={1}><Skeleton width="150px" /></Typography>
                        }
                    </div>
                    <div className="info">
                        <CalendarMonth sx={{ marginRight: 1 }} />
                        Đăng vào lúc:&nbsp;
                        { comment ?
                        date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()
                        :
                        <Typography component="div" variant={'body1'} marginLeft={1}><Skeleton width="120px" /></Typography>
                        }
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
                { comment ?
                comment.content
                :
                <>
                    <Typography component="div" variant={'body1'}><Skeleton /></Typography>
                    <Typography component="div" variant={'body1'}><Skeleton /></Typography>
                    <Typography component="div" variant={'body1'}><Skeleton width="20%"/></Typography>
                </>
                }
            </p>
            <ConfirmationDialog/>
        </div>
    )
}
