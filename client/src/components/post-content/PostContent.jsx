import './postcontent.css'
import { Box, CircularProgress, Grid } from '@mui/material';
import { CalendarMonth, Chat as ChatIcon, Edit as EditIcon, Delete as DeleteIcon, Sell as SellIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '../../features/posts/postsApiSlice';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';

export default function PostContent({ post, commentsCount, previewMode }) {
  const { id: currUser, isAdmin } = useAuth();
  const date = new Date(post.createdAt);
  const [deletePost, { isLoading, isSuccess }] = useDeletePostMutation();
  const navigate = useNavigate();
  const [ConfirmationDialog, confirmDelete] = useConfirm(
    'Xoá bài viết?',
    'Bạn có muốn xoá bài viết này?',
  )

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

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
      <div className="postContentContainer">
        <h1 className="postContentTitle">
          {post.title}
        </h1>
        <Grid container className="postContentInfo">
          <Grid item className="leftInfo">
            <div className="info">
              <CalendarMonth sx={{ marginRight: 1 }} />
              Đăng vào lúc: {date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()}
            </div>
            <div className="info">
              <ChatIcon sx={{ marginRight: 1 }} />
              {commentsCount} lượt bình luận
            </div>
          </Grid>
          {((currUser == post.user || isAdmin) && !previewMode) && (
            <Grid item className="rightInfo">
              <Link to={`/edit-post/${post.slug}`} style={{ textDecoration: 'none' }}>
                <Box className="infoButton" sx={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
                  <EditIcon sx={{ marginRight: 1 }} />
                  Chỉnh sửa
                </Box>
              </Link>
              <button className="infoButton"
                style={{ color: '#f25a5a', borderColor: '#f25a5a', marginLeft: '15px'}}
                disabled={isLoading}
                onClick={onDeleteClicked}>
                <DeleteIcon sx={{ marginRight: 1 }} />
                Xoá bài
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
          )}
        </Grid>
        <div className="postContent">
          <Box display="flex" justifyContent="center">
            <img className="postContentThumbnail" alt=""
              src={post.thumbnail}
            />
          </Box>
          <div className="postContentDescription">
            {post.description}
          </div>
          <div className="postContentMarkdown" dangerouslySetInnerHTML={{ __html: post.sanitizedHtml }} />
        </div>
        <figure className="authorInfo">
          <Link to={`/search?author=${post?.author ? post.author : ''}`}>
            <figcaption>- Người viết: {post.author ?? "Vô danh"}</figcaption>
          </Link>
        </figure>
        <div className="tagInfo">
          <div className="tag">
            <SellIcon />
            Từ khoá:
          </div>
          <ul className="tagsList">
            {post?.tags?.map((tag, index) => (
              <li>
                <Link to={`/search?tags=${tag}`} key={index} className="smallTag">{tag}</Link>
              </li>
            ))}
          </ul>
        </div>
        <ConfirmationDialog/>
      </div>
    )
  }
}
