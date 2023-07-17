import './editpost.css';
import { Box, Container, Dialog, DialogActions, DialogContent, TextField, TextareaAutosize, useMediaQuery, useTheme } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../../context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { marked } from "marked";
import PostContent from '../../components/post-content/PostContent';

const CustomInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: 0,
    backgroundColor: 'white',
    color: 'black',
  },
  '& label.Mui-focused': {
    color: '#b4a0a8'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '& fieldset': {
      borderRadius: 0,
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderRadius: 0,
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderRadius: 0,
      borderColor: '#6F7E8C',
    },
  },
  '& input:valid + fieldset': {
    borderColor: 'lightgray',
    borderRadius: 0,
    borderWidth: 1,
  },
  '& input:invalid + fieldset': {
    borderColor: '#f25a5a',
    borderRadius: 0,
    borderWidth: 1,
  },
  '& input:valid:focus + fieldset': {
    borderColor: '#0f3e3c',
    borderLeftWidth: 4,
    borderRadius: 0,
    padding: '4px !important',
  },
}));

const PF = "http://localhost:5000/images/"
export default function EditPost() {
  const {slug} = useParams();
  const [post, setPost] = useState([]);
  const inputFile = useRef(null);
  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  const [thumbnail, setThumbnail] = useState(post?.thumbnail);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const { auth } = useContext(Context);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/posts/${slug}`);
      setPost(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setThumbnail(res.data.thumbnail);
    };
    getPost();
  }, []);

  const handlePreview = () => {
    const previewPost = {
      title,
      sanitizedHtml: marked.parse(content),
      thumbnail: 'test.png',
      username: auth.username
    }
    setPreview(previewPost);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenFile = () => {
    inputFile.current.click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      thumbnail: post?.thumbnail,
      title,
      content,
      username: auth.username
    }

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedPost.thumbnail = filename;

      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const res = await axios.put(`/posts/${post?.slug}`, updatedPost);
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="newPostContainer">
      <Container fluid maxWidth="lg">
        <form className="newPost" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <p className="newPostTitle">Tạo bài viết mới</p>
            <input
              type="file"
              id="fileInput"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Box className="fileButton" onClick={handleOpenFile} sx={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
              <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
              Ảnh đại diện
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <CustomInput
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              id="title"
              label="Tiêu đề*"
              // error
              // helperText="Không được bỏ trống"
              sx={{ marginBottom: '15px' }}
            />
            <Box display="flex" justifyContent="center">
              <img className="thumbnailPreview" src={file ? URL.createObjectURL(file) : PF + thumbnail} alt="" />
            </Box>
            <TextareaAutosize
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={8}
              id="content"
              placeholder="Nội dung bài viết ..."
              className="newPostContent"
            />
            <Box display="flex" alignItems="center">
              <button type="button" className="submitButton" onClick={handlePreview}>
                Xem trước
              </button>
              <button className="submitButton">
                Chỉnh sửa
              </button>
            </Box>
          </Box>
        </form>
        <Dialog
          maxWidth={'lg'}
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
        >
          <DialogContent>
            <PostContent post={preview} previewMode={true}/>
          </DialogContent>
          <DialogActions>
            <button className="submitButton" onClick={handleClose}>
              OK
            </button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  )
}
