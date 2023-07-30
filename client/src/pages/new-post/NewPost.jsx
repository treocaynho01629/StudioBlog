import './newpost.css';
import { Autocomplete, Box, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, Grid, MenuItem, TextField, TextareaAutosize, useMediaQuery, useTheme } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, Visibility, Done } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { marked } from "marked";
import PostContent from '../../components/post-content/PostContent';
import { useCreatePostMutation, useValidatePostMutation } from '../../features/posts/postsApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';

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

export default function NewPost() {
  const [createPost, {isLoading}] = useCreatePostMutation();
  const [validatePost, {isLoading: validating}] = useValidatePostMutation();
  const { data: categories, isLoading: loadingCates, isSuccess: catesDone } = useGetCategoriesQuery();
  const inputFile = useRef(null);
  const errRef = useRef();
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [cate, setCate] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (catesDone && categories && !loadingCates) {
      setCate(categories[0].type)
    }
  }, [catesDone])

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

  const handleChangeThumbnail = (e) => {
    setThumbnail(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenFile = () => {
    inputFile.current.click();
  }

  //Post
  const validPost = [title, file, description, markdown, cate].every(Boolean) && !isLoading && !validating

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validPost) {
      try {
        //Validate
        const newPost = {
          title,
          description,
          markdown,
          category: cate,
          tags
        }
        const isValidPost = await validatePost(newPost).unwrap();
       
        if (isValidPost?.isValid) {

          //Create post
          try {
            const form = new FormData();

            form.append('title', title);
            form.append('description', description);
            form.append('markdown', markdown);
            form.append('category', cate);
            form.append('tags', tags);
            form.append('file', file);
      
            const createdPost = await createPost(form).unwrap();
            setTitle('');
            setDescription('');
            setMarkdown('');
            setCate('');
            setTags([]);
            setFile(null);
            navigate(`/post/${createdPost.slug}`);
          } catch (err){
            console.log(err);
          }
        }
      } catch (error){
        //Error handler ...
        if (!error?.status) {
            setErrMsg('Server không phản hồi');
        } else if (error?.status === 400) {
            setErrMsg(error?.data?.msg);
        } else if (error?.status === 409) {
            setErrMsg('Bài viết với tiêu đề trên đã tồn tại!');
        } else if (error?.status === 422) {
            setErrMsg('Sai định dạng thông tin!');  
            setErr({ ...error, data: new Map(error.data.errors.map(obj => [obj.path, obj.msg]))})
        } else {
            setErrMsg('Gửi bài viết thất bại!')
        }
        errRef.current.focus();
      }
    }
  }

  return (
    <div className="newPostContainer">
      <Container fluid maxWidth="lg">
        <form className="newPost" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <p className="newPostTitle">Tạo bài viết mới</p>
            <input
              required
              type="file"
              id="fileInput"
              accept="image/*"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={handleChangeThumbnail}
            />
            <Box className="fileButton" onClick={handleOpenFile} 
              sx={{ 
                color: (!validPost && !file) ? '#f25a5a' : '#0f3e3c', 
                borderColor: (!validPost && !file) ? '#f25a5a' : '#0f3e3c'
              }}>
              <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
              Ảnh đại diện
            </Box>
          </Box>
          { errMsg && <p ref={errRef} className="errorMsg">{errMsg}</p> }
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
                  error={(!validPost && !title) || err?.data?.has('title')}
                  helperText={err?.data?.has('title') && err?.data?.get('title')}
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
                  error={(!validPost && !cate) || err?.data?.has('category')}
                  helperText={err?.data?.has('category') && err?.data?.get('category')}
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
            { thumbnail &&
              <Box display="flex" justifyContent="center">
                <img className="thumbnailPreview" src={thumbnail} alt="" />
              </Box>
            }
            <CustomInput
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              InputProps={{
                inputComponent: TextareaAutosize,
                inputProps: {
                  style: {
                    resize: "auto"
                  }
                }
              }}
              id="description"
              label="Tóm tắt"
              error={(!validPost && !description) || err?.data?.has('description')}
              helperText={err?.data?.has('description') && err?.data?.get('description')}
              sx={{ marginBottom: '15px' }}
            />
            <CustomInput
              required
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              multiline
              minRows={8}
              InputProps={{
                inputComponent: TextareaAutosize,
                inputProps: {
                  style: {
                    resize: "auto"
                  }
                }
              }}
              id="markdown"
              label="Nội dung bài viết"
              error={(!validPost && !markdown) || err?.data?.has('markdown')}
              helperText={err?.data?.has('markdown') && err?.data?.get('markdown')}
              sx={{ marginBottom: '15px' }}
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
              <button type="button" 
              className="submitButton" 
              disabled={validating || isLoading}
              onClick={handlePreview}>
                Xem trước <Visibility />
              </button>
              <button className="submitButton" disabled={!validPost || validating || isLoading}>
                Đăng bài <Done />
                {(validating || isLoading) && (
                  <CircularProgress
                    size={24}
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
