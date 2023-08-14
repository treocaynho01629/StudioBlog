import './edituser.css';
import { Box, CircularProgress, Container, Grid, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import { Visibility, Done, VisibilityOff } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserQuery, useUpdateUserMutation } from '../../features/users/usersApiSlice';
import useTitle from '../../hooks/useTitle';

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

export default function EditPost() {
  const { id } = useParams();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: user, isLoading: loadingUser, isSuccess: userDone } = useGetUserQuery({ id }, {
    refetchOnMountOrArgChange: true
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [validPass, setValidPass] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(false);
  const [err, setErr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  useTitle(`Chỉnh sửa người dùng - TAM PRODUCTION`);

  useEffect(() => {
    if (userDone && user && !loadingUser) {
      setUsername(user?.username);
      setEmail(user?.email);
      setFullName(user?.fullName);
      setRole(user?.isAdmin);
    }
  }, [userDone])

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

  //Post
  const validUser = [username, email, fullName].every(Boolean) && !isLoading

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validUser) {
      try {
        //Validate
        const updatedUser = {
          username,
          email,
          isAdmin: role,
          fullName,
          ...(password && {password: password})
        }

        await updateUser({id, updatedUser}).unwrap();
        setUsername('');
        setPassword('');
        setRePassword('');
        setEmail('');
        setFullName('');
        setRole(false);
        navigate('/users-list');
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
          setErrMsg('Chỉnh sửa người dùng thất bại!')
        }
      }
    }
  }

  return (
    <div className="newUserContainer">
      <Container fluid maxWidth="lg">
        <form className="newUser" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <p className="newUserTitle">Chỉnh sửa {user?.username}</p>
          </Box>
          {errMsg && <p className="errorMsg">{errMsg}</p>}
          <Box display="flex" flexDirection="column">
            <Grid container columnSpacing={1}>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  error={(!validUser && !username) || err?.data?.has('username')}
                  helperText={err?.data?.has('username') && err?.data?.get('username')}
                  sx={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  required
                  label="Phân quyền"
                  select
                  fullWidth
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ marginBottom: '15px' }}
                >
                  <MenuItem value={false}>Người dùng</MenuItem>
                  <MenuItem value={true}>Admin</MenuItem>
                </CustomInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  id="password"
                  label="Mật khẩu mới"
                  type={showPassword ? 'text' : 'password'}
                  error={(!validUser && !password) || err?.data?.has('password')}
                  helperText={err?.data?.has('password') && err?.data?.get('password')}
                  sx={{ marginBottom: '15px' }}
                  InputProps={{
                    endAdornment: endAdornment
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  fullWidth
                  id="repassword"
                  label="Nhập lại mật khẩu mới"
                  type={showRePassword ? 'text' : 'password'}
                  error={(!validUser && !rePassword) || !validPass}
                  helperText={!validPass && 'Không trùng mật khẩu'}
                  sx={{ marginBottom: '15px' }}
                  InputProps={{
                    endAdornment: endAdornment_2
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  id="email"
                  label="Email"
                  type="email"
                  error={(!validUser && !email) || err?.data?.has('email')}
                  helperText={err?.data?.has('email') && err?.data?.get('email')}
                  sx={{ marginBottom: '15px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  id="fullName"
                  label="Họ và Tên"
                  error={(!validUser && !fullName) || err?.data?.has('fullName')}
                  helperText={err?.data?.has('fullName') && err?.data?.get('fullName')}
                  sx={{ marginBottom: '15px' }}
                />
              </Grid>
            </Grid>

            <Box display="flex" alignItems="center">
              <button className="submitButton" disabled={!validUser || isLoading}>
                Chỉnh sửa <Done sx={{marginLeft: 1}}/>
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
            </Box>
          </Box>
        </form>
      </Container>
    </div>
  )
}
