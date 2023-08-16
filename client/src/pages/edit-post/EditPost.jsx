import './editpost.css';
import { Grid, MenuItem, Autocomplete, Chip, Box, Container, Dialog, DialogActions, DialogContent, TextField, TextareaAutosize, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, Visibility, Done, HighlightOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { marked } from "marked";
import { useGetPostQuery, useUpdatePostMutation, useValidatePostMutation } from '../../features/posts/postsApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import styled from '@emotion/styled';
import PostContent from '../../components/post-content/PostContent';
import useTitle from '../../hooks/useTitle';
import useAuth from '../../hooks/useAuth';

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

const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'svg'],
  sizeLimit = 5_242_880; //5MB

export default function EditPost() {
  const { slug } = useParams();
  const { id, isAdmin } = useAuth();
  const { data: post, isLoading: loadingPost, isError: postError, isSuccess: postDone } = useGetPostQuery({ slug }, {
    refetchOnMountOrArgChange: true
  });
  const { data: categories, isLoading: loadingCates, isSuccess: catesDone } = useGetCategoriesQuery();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [validatePost, { isLoading: validating }] = useValidatePostMutation();
  const inputFile = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [thumbnail, setThumbnail] = useState("");
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
  useTitle(`Chỉnh sửa ${post?.title || 'bài viết'} - TAM PRODUCTION`);

  useEffect(() => {
    if (postDone && post && !loadingPost) {
      if (!(isAdmin || post.user == id)) navigate("/error");
      setTitle(post?.title);
      setMarkdown(post?.markdown);
      setDescription(post?.description);
      setThumbnail(post?.thumbnail);
      setCate(post?.category);
      setTags(post?.tags);
    }
  }, [postDone])

  useEffect(() => {
    if (postError && !loadingPost) navigate("/error");
  }, [postError])

  const handlePreview = () => {
    const previewPost = {
      title,
      description,
      sanitizedHtml: marked.parse(markdown),
      thumbnail,
      tags
    }
    setPreview(previewPost);
    setOpen(true);
  };

  const handleChangeThumbnail = (e) => {
    const { name: fileName, size: fileSize } = e.target.files[0];
    const fileExtension = fileName.split(".").pop();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrMsg(`${fileName} sai định dạng ảnh!`);
    } else if (fileSize > sizeLimit) {
      setErrMsg(`${fileName} kích thước quá lớn!`);
    } else {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  }

  const handleRemoveThumbnail = () => {
    setFile(null);
    setThumbnail(post?.thumbnail);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenFile = () => {
    inputFile.current.click();
  }

  //Post
  const validPost = [title, description, markdown, cate].every(Boolean) && !isLoading && !validating

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validPost) {
      try {
        //Validate
        const newPost = {
          id: post?.id, //important
          title,
          description,
          markdown,
          category: cate,
          tags
        }
        const isValidPost = await validatePost(newPost).unwrap();

        if (isValidPost?.isValid) {

          //Update post
          try {
            const form = new FormData();

            form.append('title', title);
            form.append('description', description);
            form.append('markdown', markdown);
            form.append('category', cate);
            form.append('tags', tags);
            if (file) {
              form.append('file', file)
            } else {
              form.append('thumbnail', thumbnail);
            }

            const updated = await updatePost({ id: post?.id, updatedPost: form }).unwrap();

            setTitle('');
            setDescription('');
            setMarkdown('');
            setCate('');
            setTags([]);
            setFile(null);
            navigate(`/post/${updated.slug}`)
          } catch (err) {
            console.log(err);
          }
        }
      } catch (error) {
        //Error handler ...
        if (!error?.status) {
          setErrMsg('Server không phản hồi');
        } else if (error?.status === 400) {
          setErrMsg(error?.data?.msg);
        } else if (error?.status === 409) {
          setErrMsg('Bài viết với tiêu đề trên đã tồn tại!');
        } else if (error?.status === 422) {
          setErrMsg('Sai định dạng thông tin!');
          setErr({ ...error, data: new Map(error.data.errors.map(obj => [obj.path, obj.msg])) })
        } else {
          setErrMsg('Gửi bài viết thất bại!')
        }
      }
    }
  }

  let catesList;

  if (loadingCates) {
    catesList = <p>Loading...</p>
  } else if (catesDone) {
    const { ids, entities } = categories;

    catesList = ids?.length
      ? ids?.map(cateId => {
        const cate = entities[cateId];

        return (
          <MenuItem key={cateId} value={cateId}>
            {cate.name}
          </MenuItem>
        )
      })
      : null
  }

  return (
    <div className="editPostContainer">
      <Container fluid maxWidth="lg">
        <form className="editPost" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <p className="editPostTitle">Chỉnh sửa bài viết</p>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={handleChangeThumbnail}
            />
            <Box className="fileButton" onClick={handleOpenFile}
              sx={{
                color: '#0f3e3c',
                borderColor: '#0f3e3c'
              }}>
              <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
              Ảnh đại diện
            </Box>
          </Box>
          {errMsg && <p className="errorMsg">{errMsg}</p>}
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
                  {catesList}
                </CustomInput>
              </Grid>
            </Grid>
            {thumbnail &&
              <Box display="flex" justifyContent="center">
                {file &&
                  <Box className="removeButton" onClick={handleRemoveThumbnail}>
                    <HighlightOff sx={{ marginRight: 1 }} />
                    Gỡ ảnh
                  </Box>
                }
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
                  minRows: 3,
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
                  minRows: 8,
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
                Xem trước <Visibility sx={{ marginLeft: 1 }} />
              </button>
              <button className="submitButton" disabled={!validPost || validating || isLoading}>
                Cập nhât <Done sx={{ marginLeft: 1 }} />
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
