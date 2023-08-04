import './comments.css'
import { Box, TextField, TextareaAutosize } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import styled from '@emotion/styled';
import Comment from '../comment/Comment';
import { useState } from 'react';

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

export default function Comments() {
    const [remember, setRemember] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");

    let commentsList = (
        <div>
            <Comment/>
        </div>
    )

    const validComment = [fullName, email, content].every(Boolean);

    return (
        <div className="postComments">
            <p className="commentTitle">
                <ChatIcon sx={{ marginRight: 1 }} />Ý kiến bạn đọc (9 bình luận)
            </p>
            {commentsList}
            <form className="leaveComment">
                <p className="leaveTitle">Để lại ý kiến</p>
                <p className="rememberComment">
                    <input id="remember" type="checkbox" value="remember" />
                    <label htmlFor="remember" >Lưu tên và email của tôi trong trình duyệt này cho lần bình luận kế tiếp.</label>
                </p>
                <Box display="flex" flexDirection="column">
                    <CustomInput
                        fullWidth
                        id="fullName"
                        label="Họ và Tên*"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        sx={{ marginBottom: '15px' }}
                    />
                    <CustomInput
                        fullWidth
                        type="email"
                        id="email"
                        label="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginBottom: '15px' }}
                    />
                    <CustomInput
                        multiline
                        minRows={4}
                        InputProps={{
                            inputComponent: TextareaAutosize,
                            inputProps: {
                                minRows: 4,
                                style: {
                                    resize: "auto"
                                }
                            }
                        }}
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        label="Ý kiến của bạn*"
                    />
                    <button className="commentButton">
                        Gửi ý kiến
                    </button>
                </Box>
            </form>
        </div>
    )
}
