import './login.css'
import { Box, Container, TextField, TextareaAutosize } from '@mui/material';
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

export default function Login() {
  return (
    <div className="newPostContainer">
      <Container fluid maxWidth="lg">
        <form className="newPost">
          <p className="newPostTitle">Đăng nhập</p>
          <Box display="flex" flexDirection="column">
            <CustomInput
                error
                fullWidth
                id="username"
                label="Tên đăng nhập"
                helperText="Không được bỏ trống"
                sx={{marginBottom: '15px'}}
            />
            <CustomInput
                error
                fullWidth
                id="password"
                type="password"
                label="Mật khẩu"
                helperText="Không được bỏ trống"
                sx={{marginBottom: '15px'}}
            />
            <button className="submitButton">
              Đăng nhập
            </button>
          </Box>
        </form>
      </Container>
    </div>
  )
}
