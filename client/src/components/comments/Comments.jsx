import './comments.css'
import { Box, TextField, TextareaAutosize } from '@mui/material';
import { CalendarMonth, Chat as ChatIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
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

export default function Comments() {
  return (
    <div className="postComments">
        <p className="commentTitle">
            <ChatIcon sx={{marginRight: 1}}/>Ý kiến bạn đọc (9 bình luận)
        </p>
        <div className="commentContainer">
            <div className="commentInfo">
            <Box className="leftInfo" display="flex" alignItems="center">
                <div className="info">
                <PersonIcon sx={{marginRight: 1}}/>
                Nguyễn Văn A
                </div>
                <div className="info">
                <CalendarMonth sx={{marginRight: 1}}/>
                Đăng vào lúc: 2023-06-13 02:08:11
                </div>
            </Box>
            <Box className="rightInfo" display="flex" alignItems="center">
                <Box className="infoButton" sx={{color: '#f25a5a', borderColor: '#f25a5a'}}>
                <DeleteIcon sx={{marginRight: 1}}/>
                Xoá
                </Box>
            </Box>
            </div>
            <p className="commentContent">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
        <form className="leaveComment">
            <p className="leaveTitle">Để lại ý kiến</p>
            <p class="rememberComment">
                <input type="checkbox" value="remember"/> 
                <label>Lưu tên và email của tôi trong trình duyệt này cho lần bình luận kế tiếp.</label>
            </p>
            <Box display="flex" flexDirection="column">
            <CustomInput
                error
                fullWidth
                id="fullName"
                label="Họ và Tên*"
                defaultValue="Nguyễn Văn A"
                helperText="Không được bỏ trống"
                sx={{marginBottom: '15px'}}
            />
            <CustomInput
                error
                fullWidth
                type="email"
                id="email"
                label="Email*"
                defaultValue="haductrong01629@gmail.com"
                helperText="Sai định dạng email"
                sx={{marginBottom: '15px'}}
            />
            <TextareaAutosize
                minRows={4}
                value="Blah blah"
                placeholder="Ý kiến của bạn ..."
                className="commentTextarea"
            />
            <button className="submitButton">
                Gửi ý kiến
            </button>
            </Box>
        </form>
    </div>
  )
}
