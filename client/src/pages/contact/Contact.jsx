import './contact.css';
import { Box, Container, Grid, TextField, TextareaAutosize } from '@mui/material';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import styled from '@emotion/styled';
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

export default function Contact() {
    useTitle("Liên hệ - TAM PRODUCTION");

    return (
        <div className="contactContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route="Liên hệ" />
                <h1 className="alternativeTitle">LIÊN HỆ</h1>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column">
                            <CustomInput
                                fullWidth
                                size="small"
                                id="fullName"
                                label="Họ và Tên"
                                sx={{ marginBottom: '15px' }}
                            />
                            <CustomInput
                                fullWidth
                                size="small"
                                id="phone"
                                label="Số điện thoại"
                                sx={{ marginBottom: '15px' }}
                            />
                            <CustomInput
                                fullWidth
                                size="small"
                                type="email"
                                id="email"
                                label="Email"
                                sx={{ marginBottom: '15px' }}
                            />
                            <CustomInput
                                multiline
                                minRows={3}
                                size="small"
                                InputProps={{
                                    inputComponent: TextareaAutosize,
                                    inputProps: {
                                        style: {
                                            resize: "auto"
                                        }
                                    }
                                }}
                                id="content"
                                label="Nội dung"
                            />
                            <button className="contactButton">
                                Gửi ý kiến
                            </button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="contactLogo">TAM PRODUCTION</div>
                        <ul className="contactInfoList">
                            <li className="contactInfo"><b>Địa chỉ:</b> 217/24/12 Ngô Quyền, Phường 6, Tp Đà Lạt</li>
                            <li className="contactInfo"><b>Hotline:</b> 0908747742 (Mr Tâm)</li>
                            <li className="contactInfo"><b>Email:</b> tamproduction102@gmail.com</li>
                        </ul>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
