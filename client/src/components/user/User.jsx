import './user.css';
import { Box, CircularProgress, Paper, Skeleton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person as UserIcon, ManageAccounts as AdminIcon } from '@mui/icons-material';
import { useDeleteUserMutation } from '../../features/users/usersApiSlice';
import { Link } from 'react-router-dom';
import useConfirm from '../../hooks/useConfirm';

export default function User({ user }) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [ConfirmationDialog, confirmDelete] = useConfirm(
    'Xoá người dùng?',
    'Bạn có muốn xoá người dùng này?',
  )

  const onDeleteClicked = async () => {
    const confirmation = await confirmDelete()
    if (confirmation) {
      await deleteUser({ id: user?.id })
    } else {
      console.log('cancel delete');
    }
  }

  return (
    <Paper square elevation={2} className="userContainer">
      <div className="userInfo">
        {user ?
          <h3 className="usernameInfo" style={{ color: user.isAdmin ? '#0f3e3c' : 'black' }}>
            {user.isAdmin ? <AdminIcon /> : <UserIcon />}{user.username}
          </h3>
          :
          <Typography variant={'h5'}><Skeleton width="150px" /></Typography>
        }
        <p className="userLine"><b>Tên:&nbsp;</b>
          {user ?
            user.fullName
            :
            <Typography variant={'body1'}><Skeleton width="150px" /></Typography>
          }
        </p>
      </div>
      <Box display="flex" justifyContent="space-between" sx={{ padding: '0px 5px' }}>
        <p className="userLine" style={{ marginTop: 0 }}><b>Ngày tham gia:&nbsp;</b>
          {user ?
            new Date(user.createdAt).toLocaleDateString()
            :
            <Typography variant={'body1'}><Skeleton width="120px" /></Typography>
          }
        </p>
        {user ?
          (!user.isAdmin ?
            <div className=" userAction">
              <Link to={`/edit-user/${user.id}`}>
                <button className="userInfoButton" style={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
                  <EditIcon />
                </button>
              </Link>
              <button className="userInfoButton"
                style={{ color: '#f25a5a', borderColor: '#f25a5a' }}
                disabled={isLoading}
                onClick={onDeleteClicked}>
                <DeleteIcon />
                {isLoading && (
                  <CircularProgress
                    size={22}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-11px',
                      marginLeft: '-11px',
                    }}
                  />
                )}
              </button>
            </div>
            : null
          )
          :
          <div className="userAction">
            <button className="userInfoButton" disabled><EditIcon /></button>
            <button className="userInfoButton" disabled><DeleteIcon /></button>
          </div>
        }
      </Box>
      <ConfirmationDialog />
    </Paper>
  )
}
