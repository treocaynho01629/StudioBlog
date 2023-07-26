import './editpost.css';
import { Grid, MenuItem, Autocomplete, Chip, Box, Container, Dialog, DialogActions, DialogContent, TextField, TextareaAutosize, useMediaQuery, useTheme } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, Visibility, Done } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { marked } from "marked";
import PostContent from '../../components/post-content/PostContent';
import useFetch from '../../hooks/useFetch';
import { useGetPostQuery, useUpdatePostMutation } from '../../features/posts/postsApiSlice';

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
  const { slug } = useParams();
  const { data: post, isLoading: loadingPost } = useGetPostQuery({ slug });
  const [updatePost, {
    data: updatedPost,
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdatePostMutation();
  const inputFile = useRef(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [cate, setCate] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { data: dataCategories, isLoading: loadingCategories } = useFetch("/categories");

  useEffect(() => {
    if (!loadingPost && post) {
      setTitle(post?.title);
      setMarkdown(post?.markdown);
      setDescription(post?.description);
      setThumbnail(post?.thumbnail);
      setCate(post?.cate);
      setTags(post?.tags);
    }
  }, [post])

  useEffect(() => {
    if (!loadingCategories && dataCategories) {
      setCategories(dataCategories);
      setCate(dataCategories[0].type)
    }
  }, [dataCategories])

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setDescription('');
      setMarkdown('');
      setCate('');
      setTags([]);
      setFile(null);
      navigate(`/post/${updatedPost.slug}`)
    }
  }, [isSuccess, navigate])

  const handlePreview = () => {
    const previewPost = {
      title,
      description,
      sanitizedHtml: marked.parse(markdown),
      thumbnail: 'test.png',
      tags
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

  //Post
  const validPost = [title, description, markdown, cate].every(Boolean) && !isLoading

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Create post
    if (validPost) {
      const updatedPost = new FormData();

      updatedPost.append('title', title);
      updatedPost.append('description', description);
      updatedPost.append('markdown', markdown);
      updatedPost.append('category', cate);
      updatedPost.append('tags', tags);
      
      if (file) {
        updatedPost.append('file', file)
      } else if (thumbnail) {
        updatedPost.append('thumbnail', thumbnail);
      }

      await updatePost({ id: post?.id, updatedPost }).unwrap();
    }
  }

  return (
    <div className="editPostContainer">
       <Container fluid maxWidth="lg">
        <form className="editPost" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <p className="editPostTitle">Chỉnh sửa bài viết</p>
            <input
              required
              type="file"
              id="fileInput"
              accept="image/*"
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
            <Grid container columnSpacing={1}>
              <Grid item xs={12} sm={9}>
                <CustomInput
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  id="title"
                  label="Tiêu đề"
                  // error
                  // helperText="Không được bỏ trống"
                  sx={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomInput
                  required
                  label="Danh mục"
                  select
                  fullWidth
                  id="category"
                  value={cate}
                  onChange={(e) => setCate(e.target.value)}
                >
                  {categories?.map((cate, index) => (
                    <MenuItem key={index} value={cate.type}>
                      {cate.name}
                    </MenuItem>
                  ))}
                </CustomInput>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center">
              <img className="thumbnailPreview" src={file ? URL.createObjectURL(file) : thumbnail} alt="" />
            </Box>
            <TextareaAutosize
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              id="description"
              placeholder="Tóm tắt"
              className="editPostContent"
            />
            <TextareaAutosize
              required
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              minRows={8}
              id="markdown"
              placeholder="Nội dung bài viết ..."
              className="editPostContent"
            />
            <Autocomplete
              multiple
              freeSolo
              value={tags}
              options={[]}
              onChange={(e, value) => setTags((state) => value)}
              renderTags={(tags, getTagProps) =>
                tags.map((option, index) => (
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={params => (
                <CustomInput
                  {...params}
                  variant="outlined"
                  label="Từ khoá"
                  placeholder="Thêm từ khoá cho bài"
                />
              )}
            />
            <Box display="flex" alignItems="center">
              <button type="button" className="submitButton" onClick={handlePreview}>
                Xem trước <Visibility />
              </button>
              <button className="submitButton">
                Chỉnh sửa <Done />
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
            <PostContent post={preview} previewMode={true} />
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
