import './newpost.css'
import { Box, Container, TextField, TextareaAutosize } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styled from '@emotion/styled';

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
      borderColor: '#2f6b4f',
      borderLeftWidth: 4,
      borderRadius: 0,
      padding: '4px !important', 
  },
}));

export default function NewPost() {
  return (
    <div className="newPostContainer">
      <Container fluid maxWidth="lg">
        <form className="newPost">
          <p className="newPostTitle"><AddCircleOutlineIcon sx={{marginRight: '10px'}}/>Tạo bài viết mới</p>
          <Box display="flex" flexDirection="column">
            <CustomInput
                error
                fullWidth
                id="title"
                label="Tiêu đề*"
                helperText="Không được bỏ trống"
                sx={{marginBottom: '15px'}}
            />
            <TextareaAutosize
                minRows={8}
                id="content"
                value="Blah blah"
                placeholder="Nội dung bài viết ..."
                className="newPostContent"
            />
            <button className="submitButton">
              Đăng bài
            </button>
          </Box>
        </form>
      </Container>
    </div>
  )
}
