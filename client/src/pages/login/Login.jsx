import './login.css'
import { Container, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { Context } from '../../context/Context';
import { useState } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import { LoginSuccess } from '../../context/Action';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CustomInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        backgroundColor: 'white',
        color: 'black'
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch, isLoading } = useContext(Context);

  const handleClick = () => setShowPassword((showPassword) => !showPassword);

  const handleMouseDown = (e) => {
      e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type: "LOGIN_START"});
    try{
      const res = await axios.post("/auth/login", {
        username: username,
        password: password
      })
      dispatch(LoginSuccess(res.data))
    } catch(err) {
      dispatch({type: "LOGIN_FAIL"});
    }
  }

  const endAdornment=
  <InputAdornment position="end">
      <IconButton
          aria-label="toggle password visibility"
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          edge="end"
          sx={{
          "&:focus": {
              outline: 'none',
          }}}
      >
          {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
  </InputAdornment>

  return (
    <div className="loginContainer">
      <Container fluid maxWidth="lg" sx={{display: 'flex', justifyContent: 'center'}}>
        <form className="login" onSubmit={handleSubmit}>
          <Paper square elevation={3} className="loginBox">
            <p className="loginTitle">ĐĂNG NHẬP</p>
            <CustomInput
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                label="Tên đăng nhập"
                // helperText="Không được bỏ trống"
                sx={{marginBottom: '15px', maxWidth: '400px'}}
            />
            <CustomInput
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu"
                // helperText="Không được bỏ trống"
                sx={{marginBottom: '15px', maxWidth: '400px'}}
                InputProps={{
                  endAdornment: endAdornment
                }}
            />
             <div className="persistCheck">
                <p className="persist">
                    <input id="persist" type="checkbox" value="persist"/> 
                    <label htmlFor="persist">Lưu đăng nhập</label>
                </p>
                <div className="forgot">Quên mật khẩu</div>
            </div>
            <button className="loginButton" disabled={isLoading}>
              Đăng nhập
            </button>
          </Paper>
        </form>
      </Container>
    </div>
  )
}
