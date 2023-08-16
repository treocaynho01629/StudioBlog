import './register.css'
import { CircularProgress, Container, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
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

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [validPass, setValidPass] = useState(false);
  const [err, setErr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  useTitle(`Đăng ký - TAM PRODUCTION`);

  useEffect(() => {
    setErrMsg("");
    setErr("");
  }, [username, password, rePassword, email, fullName]);

  useEffect(() => {
    const valid = password === rePassword;
    setValidPass(valid);
  }, [password, rePassword])

  const handleClick = () => setShowPassword((showPassword) => !showPassword);
  const handleClickRe = () => setShowRePassword((showRePassword) => !showRePassword);
  const handleMouseDown = (e) => { e.preventDefault() };

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

  const endAdornment_2 =
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickRe}
        onMouseDown={handleMouseDown}
        edge="end"
        sx={{
          "&:focus": {
            outline: 'none',
          }
        }}
      >
        {showRePassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>

  const validUser = [username, password, rePassword, email, fullName].every(Boolean) && !isLoading

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validUser) {
      try {
        //Validate
        const newUser = {
          username,
          password,
          email,
          fullName
        }

        await register(newUser).unwrap();
        setUsername('');
        setPassword('');
        setRePassword('');
        setEmail('');
        setFullName('');
        setErr('');
        setErrMsg('');
        setSuccess(true);
      } catch (error) {
        //Error handler ...
        if (!error?.status) {
          setErrMsg('Server không phản hồi');
        } else if (error?.status === 400) {
          setErrMsg(error?.data?.msg);
        } else if (error?.status === 409) {
          setErrMsg('Tên đăng nhập hoặc email trên đã được sử dụng!');
        } else if (error?.status === 422) {
          setErrMsg('Sai định dạng thông tin!');
          setErr({ ...error, data: new Map(error.data.errors.map(obj => [obj.path, obj.msg])) })
        } else {
          setErrMsg('Đăng ký thất bại!')
        }
      }
    }
  }

  return (
    <div className="registerContainer">
      <Container fluid maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        {!success ?
          <form className="register" onSubmit={handleSubmit}>
            <Paper square elevation={3} className="registerBox">
              <p className="registerTitle">ĐĂNG KÝ</p>
              <p className="errorMsg" aria-live="assertive">{errMsg}</p>
              <CustomInput
                label="Tên đăng nhập (5-30 ký tự)"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={err?.data?.has('username')}
                helperText={err?.data?.has('username') && err?.data?.get('username')}
                sx={{ marginBottom: '15px', maxWidth: '400px' }}
                fullWidth
              />
              <CustomInput
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={err?.data?.has('email')}
                helperText={err?.data?.has('email') && err?.data?.get('email')}
                sx={{ marginBottom: '15px', maxWidth: '400px' }}
                fullWidth
              />
              <CustomInput
                label="Họ và tên"
                id="fullName"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                error={err?.data?.has('fullName')}
                helperText={err?.data?.has('fullName') && err?.data?.get('fullName')}
                sx={{ marginBottom: '15px', maxWidth: '400px' }}
                fullWidth
              />
              <CustomInput
                label="Mật khẩu (5-50 ký tự)"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                error={err?.data?.has('password')}
                helperText={err?.data?.has('password') && err?.data?.get('password')}
                InputProps={{
                  endAdornment: endAdornment
                }}
                sx={{ marginBottom: '15px', maxWidth: '400px' }}
                fullWidth
              />
              <CustomInput
                label="Nhập lại mật khẩu"
                id="rePassword"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                type={showRePassword ? 'text' : 'password'}
                error={!validPass}
                helperText={!validPass && 'Không trùng mật khẩu'}
                InputProps={{
                  endAdornment: endAdornment_2
                }}
                sx={{ marginBottom: '15px', maxWidth: '400px' }}
                fullWidth
              />
              <div className="persistCheck">
                <div className="forgot">
                  <Link to="/login">Đã có tài khoản?</Link>
                </div>
              </div>
              <button className="registerButton" disabled={!validUser || isLoading}>
                Đăng ký
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
          :
          <Paper square elevation={3} className="registerBox" sx={{width: '500px'}}>
            <p className="registerTitle">ĐĂNG KÝ THÀNH CÔNG!</p>
            <Link to="/login">
              <button className="registerButton" disabled={isLoading}>
                Đăng nhập ngay
              </button>
            </Link>
          </Paper>
        }
      </Container>
    </div>
  )
}
