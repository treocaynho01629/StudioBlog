import './profile.css'
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Done, VisibilityOff, Visibility } from '@mui/icons-material';
import { useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from '../../features/users/usersApiSlice';
import { useRefreshMutation, useSignoutMutation } from '../../features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPersist } from '../../features/auth/authSlice';
import styled from '@emotion/styled';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';
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

export default function Profile() {
  const { id, username, isAdmin } = useAuth();
  const [refresh] = useRefreshMutation();
  const [signout, { isSuccess: loggedOut }] = useSignoutMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const { data: user, isLoading: loadingUser, isSuccess: userDone } = useGetUserQuery({ id }, {
    refetchOnMountOrArgChange: true
  });
  const [userfield, setUserField] = useState("");
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
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useTitle(`Hồ sơ ${username} - TAM PRODUCTION`);
  const [ConfirmationDialog, confirmDelete] = useConfirm(
    'Xoá tài khoản?',
    `Bạn có chắc muốn xoá tài khoản ${username}?`,
  )

  useEffect(() => {
    if (userDone && user && !loadingUser) {
      setUserField(user?.username);
      setEmail(user?.email);
      setFullName(user?.fullName);
      setSuccess(false);
    }
  }, [userDone, editMode])

  useEffect(() => {
    const valid = password === rePassword;
    setValidPass(valid);
  }, [password, rePassword])

  useEffect(() => {
    if (loggedOut) {
      navigate('/')
    }
  }, [loggedOut, navigate])

  const onDeleteClicked = async () => {
    const confirmation = await confirmDelete()
    if (confirmation) {
      await deleteUser({ id });
      dispatch(setPersist(false));
      signout();
    } else {
      console.log('cancel delete');
    }
  }

  const handleToggleEdit = () => {
    setEditMode(prev => !prev);
  };

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

  const validProfile = [username, email, fullName].every(Boolean) && !updating && !deleting

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validProfile) {
      try {
        //Validate
        const updatedUser = {
          username: userfield,
          email,
          fullName,
          ...(password && { password: password })
        }

        await updateUser({ id, updatedUser }).unwrap();
        setPassword('');
        setRePassword('');
        setErrMsg('');
        setErr('');
        setSuccess(true);
        await refresh(); //Refresh token after update
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
          setErrMsg('Chỉnh sửa hồ sơ thất bại!')
        }
      }
    }
  }

  return (
    <div className="profileContainer">
      <Container fluid maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <h1 className="alternativeTitle">HỒ SƠ {username.toUpperCase()}</h1>
          <button className="infoButton"
            onClick={handleToggleEdit}
            disabled={loadingUser || updating || deleting}
            sx={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
            <EditIcon sx={{ marginRight: 1 }} />
            {editMode ? 'Huỷ cập nhật' : 'Cập nhật'}
          </button>
        </Box>

        <Paper elevation={2} className="profileWrapper">
          {success && <p className="successMsg">Cập nhật thành công!</p>}
          {errMsg && <p className="errorMsg">{errMsg}</p>}
          <form className="profileForm" onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={5} sm={3}>
                <Stack spacing={1}>
                  <div className="profileInfoStack"><b>Tên đăng nhập: </b></div>
                  <div className="profileInfoStack"><b>Email: </b></div>
                  <div className="profileInfoStack"><b>Họ và tên: </b></div>
                  {editMode ?
                    <>
                      <div className="profileInfoStack"><b>Mật khẩu: </b></div>
                      <div className="profileInfoStack"><b>Nhập lại mật khẩu: </b></div>
                    </>
                    : null}
                </Stack>
              </Grid>
              <Grid item xs={7} sm={9}>
                <Stack spacing={1}>
                  <div className="profileInfoStack">
                    {(editMode && isAdmin) ?
                      <CustomInput
                        id="userfield"
                        value={userfield}
                        onChange={(e) => setUserField(e.target.value)}
                        error={(!validProfile && !username) || err?.data?.has('username')}
                        helperText={err?.data?.has('username') && err?.data?.get('username')}
                        size="small"
                        fullWidth
                      />
                      :
                      <p>
                        { (userDone && user) ?
                          username
                          :
                          <Typography component="div" variant={'body1'}><Skeleton width="120px" /></Typography>
                        }
                      </p>}
                  </div>
                  <div className="profileInfoStack">
                    {(editMode && isAdmin) ?
                      <CustomInput
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={(!validProfile && !email) || err?.data?.has('email')}
                        helperText={err?.data?.has('email') && err?.data?.get('email')}
                        size="small"
                        fullWidth
                      />
                      :
                      <p>
                        { (userDone && user) ?
                          email
                          :
                          <Typography component="div" variant={'body1'}><Skeleton width="220px" /></Typography>
                        }
                      </p>}
                  </div>
                  <div className="profileInfoStack">
                    {editMode ?
                      <CustomInput
                        id="fullName"
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        error={(!validProfile && !fullName) || err?.data?.has('fullName')}
                        helperText={err?.data?.has('fullName') && err?.data?.get('fullName')}
                        size="small"
                        fullWidth
                      />
                      :
                      <p>
                        { (userDone && user) ?
                          fullName
                          :
                          <Typography component="div" variant={'body1'}><Skeleton width="150px" /></Typography>
                        }
                      </p>}
                  </div>
                  {editMode ?
                    <>
                      <div className="profileInfoStack">
                        <CustomInput
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          error={(!validProfile && !password) || err?.data?.has('password')}
                          helperText={err?.data?.has('password') && err?.data?.get('password')}
                          InputProps={{
                            endAdornment: endAdornment
                          }}
                          size="small"
                          fullWidth
                        />
                      </div>
                      <div className="profileInfoStack">
                        <CustomInput
                          id="rePassword"
                          value={rePassword}
                          onChange={(e) => setRePassword(e.target.value)}
                          type={showRePassword ? 'text' : 'password'}
                          error={(!validProfile && !rePassword) || !validPass}
                          helperText={!validPass && 'Không trùng mật khẩu'}
                          InputProps={{
                            endAdornment: endAdornment_2
                          }}
                          size="small"
                          fullWidth
                        />
                      </div>
                    </>
                    : null}
                </Stack>
              </Grid>
            </Grid>
            {editMode ?
              <Box display="flex" alignItems="center">
                <button
                  className="mainButton"
                  disabled={updating || deleting || !validProfile}
                  style={{ marginRight: '10px' }}>
                  Xác nhận <Done sx={{ marginLeft: 1 }} />
                  {(updating || deleting) && (
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
                <button
                  type="button"
                  className="dangerButton"
                  disabled={updating || deleting}
                  onClick={onDeleteClicked}
                >
                  Xoá tài khoản <DeleteIcon sx={{ marginLeft: 1 }} />
                  {(updating || deleting) && (
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
              : null}
          </form>
        </Paper>
      </Container>
      <ConfirmationDialog />
    </div>
  )
}
