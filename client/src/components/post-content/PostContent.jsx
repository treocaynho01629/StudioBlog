import './postcontent.css'
import { Box } from '@mui/material';
import { CalendarMonth, Chat as ChatIcon, Edit as EditIcon, Delete as DeleteIcon, Sell as SellIcon } from '@mui/icons-material';
import { useContext } from 'react';
import { Context } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostContent({ post, previewMode }) {
  const { auth } = useContext(Context);
  const navigate = useNavigate();
  const PF = "http://localhost:5000/images/"

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: {username: auth.username}
      });
      navigate('/');
    } catch(err) {
      console.log(err);
    }
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
            Đăng vào lúc: {new Date(post.createdAt).toDateString}
          </div>
          <div className="info">
            <ChatIcon sx={{ marginRight: 1 }} />
            1 lượt đánh giá
          </div>
        </Box>
        { (auth?.username === post.username && !previewMode) && (
          <Box className="rightInfo" display="flex" alignItems="center">
            <Box className="infoButton" sx={{ color: '#2f6b4f', borderColor: '#2f6b4f' }}>
              <EditIcon sx={{ marginRight: 1 }} />
              Chỉnh sửa
            </Box>
            <Box className="infoButton" 
            sx={{ color: '#f25a5a', borderColor: '#f25a5a' }}
            onClick={handleDelete}>
              <DeleteIcon sx={{ marginRight: 1 }} />
              Xoá bài
            </Box>
          </Box>
        )}
      </div>
      <div className="postContent">
        <Box display="flex" justifyContent="center">
          <img className="postContentThumbnail" alt=""
            src={PF + post.thumbnail}
          />
        </Box>
        <p className="postContentMarkdown">
          {post.content}
        </p>
      </div>
      <figure className="authorInfo">
        <figcaption>- Người viết: {post.username}</figcaption>
      </figure>
      <div className="tagInfo">
        <div className="tag">
          <SellIcon />
          Từ khoá:
        </div>
        <div className="smallTag">
          hoho
        </div>
      </div>
    </div>
  )
}
