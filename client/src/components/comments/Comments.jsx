import './comments.css'
import { Box, CircularProgress, TextField, TextareaAutosize } from '@mui/material';
import { Chat as ChatIcon, Done } from '@mui/icons-material';
import styled from '@emotion/styled';
import Comment from '../comment/Comment';
import { useEffect, useState } from 'react';
import { useCreateCommentMutation, useGetCommentsQuery } from '../../features/comments/commentsApiSlice';

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

export default function Comments({ postId, setCommentsCount }) {
    const [createComment, { isLoading: commenting }] = useCreateCommentMutation();
    const [pagination, setPagination] = useState({
        currPage: 1,
        pageSize: 2,
        numberOfPages: 0,
    });
    const [fullComments, setFullComments] = useState([]);
    const { data: comments, isLoading, isSuccess, isError, error } = useGetCommentsQuery({ 
        post: postId,
        page: pagination.currPage,
        size: pagination.pageSize,
    });
    const [remember, setRemember] = useState(JSON.parse(localStorage.getItem("info")) ? true : false);
    const [fullName, setFullName] = useState(JSON.parse(localStorage.getItem("info"))?.fullName || "");
    const [email, setEmail] = useState(JSON.parse(localStorage.getItem("info"))?.email || "");
    const [content, setContent] = useState("");
    const [err, setErr] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if (!isLoading && isSuccess && comments){
            const { ids, entities } = comments;
            setPagination({ ...pagination, numberOfPages: comments?.info?.numberOfPages});
            setCommentsCount(comments?.info?.totalElements);

            if (ids?.length){
                ids.map(commentId => {
                    const comment = entities[commentId];
                    if (!fullComments.includes(comment)) {
                        setFullComments(current => [...current, comment]);
                    }
                    
                })
            }
            console.log(pagination);
        }
    }, [comments])

    const handleReset = () => {
        setPagination({ ...pagination, currPage: 1});       
        setFullComments([]);
    }

    const handleLoadMore = () => {
        if (pagination.currPage < pagination.numberOfPages){
            setPagination({ ...pagination, currPage: pagination.currPage + 1});
        }
    }

    const handleToggleRemember = () => {
        setRemember(prev => !prev);
        if (!remember) {
            localStorage.setItem("info", JSON.stringify({ fullName, email }));
        } else {
            localStorage.removeItem("info");
        }
    };

    const validComment = [fullName, email, content].every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validComment) {
            try {
                const newComment = {
                    fullName,
                    email,
                    content
                }
                const createdComment = await createComment({ postId, newComment }).unwrap();

                setErrMsg("");
                setErr("");
                setContent("");

                if (!remember) {
                    setFullName("");
                    setEmail("");
                } else {
                    localStorage.setItem("info", JSON.stringify({ fullName, email }));
                }

                handleReset();
            } catch (error) {
                if (!error.status) {
                    setErrMsg("Server không phản hồi!");
                } else if (error.status === 400) {
                    setErrMsg("Vui lòng nhập đầy đủ thông tin!");
                } else if (error.status === 409) {
                    setErrMsg("Ý kiến với email này đã tồn tại!");
                } else if (error.status === 422) {
                    setErrMsg('Sai định dạng thông tin!');
                    setErr({ ...error, data: new Map(error.data.errors.map(obj => [obj.path, obj.msg])) })
                } else {
                    setErrMsg("Gửi ý kiến thất bại!");
                }
            }
        } else {
            setErrMsg("Vui lòng nhập đầy đủ thông tin!");
        }
    }

    let commentsContainer;

    if (isLoading) {
        commentsContainer = <p>Loading...</p>
    } else if (isSuccess) {
        commentsContainer = (
            <div className="commentsContainer">
                {fullComments?.map((comment) => {
                    return (<Comment key={comment.id} comment={comment}/>)
                })}
            </div>
        )
    } else if (isError) {
        commentsContainer = null;
    }

    return (
        <div className="postComments">
            <p className="commentTitle">
                <ChatIcon sx={{ marginRight: 1 }} />Ý kiến bạn đọc ({comments?.info?.totalElements || 0} bình luận)
            </p>
            {commentsContainer}
            { ((pagination.currPage < pagination.numberOfPages) && pagination.numberOfPages > 1) &&
                <button className="showMore" onClick={handleLoadMore} disabled={isLoading}>
                    Xem các ý kiến cũ
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
            }
            <form className="leaveComment" onSubmit={handleSubmit}>
                <p className="leaveTitle">Để lại ý kiến</p>
                <p className="rememberComment">
                    <input id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={handleToggleRemember}
                    />
                    <label htmlFor="remember" >Lưu tên và email của tôi trong trình duyệt này cho lần bình luận kế tiếp.</label>
                </p>
                {errMsg && <p className="errorMsg">{errMsg}</p>}
                <Box display="flex" flexDirection="column">
                    <CustomInput
                        fullWidth
                        id="fullName"
                        label="Họ và Tên*"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={err?.data?.has('fullName')}
                        helperText={err?.data?.has('fullName') && err?.data?.get('fullName')}
                        sx={{ marginBottom: '15px' }}
                    />
                    <CustomInput
                        fullWidth
                        type="email"
                        id="email"
                        label="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={err?.data?.has('email')}
                        helperText={err?.data?.has('email') && err?.data?.get('email')}
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
                        error={ err?.data?.has('content')}
                        helperText={err?.data?.has('content') && err?.data?.get('content')}
                        label="Ý kiến của bạn*"
                    />
                    <button className="commentButton" disabled={commenting}>
                        Gửi ý kiến <Done />
                        {commenting && (
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
            </form>
        </div>
    )
}
