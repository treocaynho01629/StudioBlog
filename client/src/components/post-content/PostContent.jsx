import './postcontent.css'
import { Box } from '@mui/material';
import { CalendarMonth, Chat as ChatIcon, Edit as EditIcon, Delete as DeleteIcon, Sell as SellIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '../../features/posts/postsApiSlice';
import useAuth from '../../hooks/useAuth';

export default function PostContent({ post, previewMode }) {
  const { id: currUser, isAdmin } = useAuth();
  const date = new Date(post.createdAt)
  const navigate = useNavigate();

  const [deletePost, {
    isSuccess,
    isError,
    error,
  }] = useDeletePostMutation()

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate])

  const onDeleteClicked = async () => {
    await deletePost({ id: post.id })
  }

  return (
    <div className="postContentContainer">
      <h1 className="postContentTitle">
        {post.title}
      </h1>
      <div className="postContentInfo">
        <Box className="leftInfo" display="flex" alignItems="center">
          <div className="info">
            <CalendarMonth sx={{ marginRight: 1 }} />
            Đăng vào lúc: { date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()
            }
          </div>
          <div className="info">
            <ChatIcon sx={{ marginRight: 1 }} />
            1 lượt đánh giá
          </div>
        </Box>
        { ((currUser == post.user || isAdmin) && !previewMode) && (
          <Box className="rightInfo" display="flex" alignItems="center">
            <Link to={`/edit-post/${post.slug}`} style={{textDecoration: 'none'}}>
              <Box className="infoButton" sx={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
                <EditIcon sx={{ marginRight: 1 }} />
                Chỉnh sửa
              </Box>
            </Link>
            <Box className="infoButton" 
            sx={{ color: '#f25a5a', borderColor: '#f25a5a' }}
            onClick={onDeleteClicked}>
              <DeleteIcon sx={{ marginRight: 1 }} />
              Xoá bài
            </Box>
          </Box>
        )}
      </div>
      <div className="postContent">
        <Box display="flex" justifyContent="center">
          <img className="postContentThumbnail" alt=""
            src={post.thumbnail}
          />
        </Box>
        <div className="postContentMarkdown" dangerouslySetInnerHTML={{ __html: post.sanitizedHtml }}/>
      </div>
      <figure className="authorInfo">
        <figcaption>- Người viết: {post.author ? post.auth : "Vô danh"}</figcaption>
      </figure>
      <div className="tagInfo">
        <div className="tag">
          <SellIcon />
          Từ khoá:
        </div>
        {post.tags.map((tag, index) => (
            <div key={index} className="smallTag">{tag}</div>
        ))}
        
      </div>
    </div>
  )
}
