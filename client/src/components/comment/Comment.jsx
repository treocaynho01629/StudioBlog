import './comment.css';
import { Box } from '@mui/material';
import { CalendarMonth, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';

export default function Comment() {
    return (
        <div className="commentContainer">
            <div className="commentInfo">
                <Box className="leftInfo" display="flex" alignItems="center">
                    <div className="info">
                        <PersonIcon sx={{ marginRight: 1 }} />
                        Nguyễn Văn A
                    </div>
                    <div className="info">
                        <CalendarMonth sx={{ marginRight: 1 }} />
                        Đăng vào lúc: 2023-06-13 02:08:11
                    </div>
                </Box>
                <Box className="rightInfo" display="flex" alignItems="center">
                    <Box className="infoButton" sx={{ color: '#f25a5a', borderColor: '#f25a5a' }}>
                        <DeleteIcon sx={{ marginRight: 1 }} />
                        Xoá
                    </Box>
                </Box>
            </div>
            <p className="commentContent">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
    )
}
