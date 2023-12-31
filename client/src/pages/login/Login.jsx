import './login.css'
import { CircularProgress, Container, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setAuth, setPersist } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';

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
  useTitle(`Đăng nhập - TAM PRODUCTION`);
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const persist = usePersist();
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; //Previous route
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleClick = () => setShowPassword((showPassword) => !showPassword);

  const handleMouseDown = (e) => { e.preventDefault() };

  const handleTogglePersist = () => { dispatch(setPersist({ persist: !persist })); };

  const validLogin = [username, password].every(Boolean) && !isLoading

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validLogin){
      try {
        const { accessToken } = await login({ username, password }).unwrap();
        dispatch(setAuth({ accessToken }));
        setUsername("");
        setPassword("");
        navigate(from, { replace: true });
      } catch (err) {
        if (!err.status) {
          setErrMsg("Server không phản hồi!");
        } else if (err.status === 400) {
          setErrMsg("Vui lòng nhập đầy đủ thông tin!");
        } else if (err.status === 401) {
          setErrMsg("Sai tài khoản hoặc mật khẩu!");
        } else {
          setErrMsg(err.data?.message);
        }
        errRef.current.focus();
      }
    } else {
      setErrMsg("Vui lòng nhập đầy đủ thông tin!");
      errRef.current.focus();
    }
  }

  const endAdornment =
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        edge="end"
        sx={{
          "&:focus": {
            outline: 'none',
          }
        }}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>

  return (
    <div className="loginContainer">
      <Container fluid maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        <form className="login" onSubmit={handleSubmit}>
          <Paper square elevation={3} className="loginBox">
            <p className="loginTitle">ĐĂNG NHẬP</p>
            <p ref={errRef} className="errorMsg" aria-live="assertive">{errMsg}</p>
            <CustomInput
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              label="Tên đăng nhập"
              autoComplete="off"
              sx={{ marginBottom: '15px', maxWidth: '400px' }}
            />
            <CustomInput
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              sx={{ marginBottom: '15px', maxWidth: '400px' }}
              InputProps={{
                endAdornment: endAdornment
              }}
            />
            <div className="persistCheck">
              <p className="persist">
                <input id="persist" 
                type="checkbox" 
                checked={persist}
                onChange={handleTogglePersist}/>
                <label htmlFor="persist">Lưu đăng nhập</label>
              </p>
              <div className="forgot">
                <Link to="/register">Chưa có tài khoản?</Link>
              </div>
            </div>
            <button className="loginButton" disabled={isLoading}>
              Đăng nhập
              {isLoading && (
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
          </Paper>
        </form>
      </Container>
    </div>
  )
}
