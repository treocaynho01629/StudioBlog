import './postcontent.css'
import { Box, CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
import { CalendarMonth, Chat as ChatIcon, Edit as EditIcon, Delete as DeleteIcon, Sell as SellIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '../../features/posts/postsApiSlice';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';

export default function PostContent({ post, commentsCount, previewMode }) {
  const { id: currUser, isAdmin } = useAuth();
  const date = new Date(post?.createdAt);
  const [deletePost, { isLoading, isSuccess }] = useDeletePostMutation();
  const navigate = useNavigate();
  const [ConfirmationDialog, confirmDelete] = useConfirm(
    'Xoá bài viết?',
    'Bạn có muốn xoá bài viết này?',
  )

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const onDeleteClicked = async () => {
    const confirmation = await confirmDelete()
    if (confirmation) {
      await deletePost({ id: post?.id })
    } else {
      console.log('cancel delete');
    }
  }

  return (
    <div className="postContentContainer">
      { post ?
        <h1 className="postContentTitle">{post.title}</h1>
        :
        <Typography component="div" variant={'h3'}><Skeleton width="80%" /></Typography>
      }
      <Grid container className="postContentInfo">
        <Grid item className="leftInfo">
          <div className="info">
            <CalendarMonth sx={{ marginRight: 1 }} />
            Đăng vào lúc:&nbsp;
            {post ?
              date.toLocaleDateString("en-GB") + " - " + date.toLocaleTimeString()
              :
              <Typography component="div" variant={'body1'} marginLeft={1}><Skeleton width="120px" /></Typography>
            }
          </div>
          <div className="info">
            <ChatIcon sx={{ marginRight: 1 }} />
            {post ?
              commentsCount + " lượt bình luận"
              :
              <Typography component="div" variant={'body1'} marginLeft={1}><Skeleton width="110px" /></Typography>
            }
          </div>
        </Grid>
        {((currUser == post?.user || isAdmin) && !previewMode) && (
          <Grid item className="rightInfo">
            <Link to={`/edit-post/${post?.slug}`} style={{ textDecoration: 'none' }}>
              <Box className="infoButton" sx={{ color: '#0f3e3c', borderColor: '#0f3e3c' }}>
                <EditIcon sx={{ marginRight: 1 }} />
                Chỉnh sửa
              </Box>
            </Link>
            <button className="infoButton delete"
              style={{ color: '#f25a5a', borderColor: '#f25a5a'}}
              disabled={isLoading}
              onClick={onDeleteClicked}>
              <DeleteIcon sx={{ marginRight: 1 }} />
              Xoá bài
              {isLoading && (
                <CircularProgress
                  size={22}
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
          </Grid>
        )}
      </Grid>
      <div className="postContent">
        <Box display="flex" justifyContent="center" height="100%" width="100%">
          { post ?
            <img className="postContentThumbnail" 
              width="950"
              height="550"
              loading="lazy"
              alt={`${post.slug}-thumbnail`} 
              src={post.thumbnail}
            />
            :
            <Skeleton
              animation="wave"
              variant="rectangular"
              className="postContentThumbnail"
              height={525}
              width="100%"
            />
          }
        </Box>
        <div className="postContentDescription">
          { post ?
          post.description
          :
          <>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton width="60%"/></Typography>
          </>
          }
        </div>
        { post ?
          <div className="postContentMarkdown" dangerouslySetInnerHTML={{ __html: post.sanitizedHtml }} />
          :
          <div className="postContentMarkdown">
            <Typography component="div" variant={'h4'}><Skeleton width="30%"/></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton width="20%"/></Typography>
            <Typography component="div" variant={'h4'}><Skeleton width="50%"/></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton width="90%"/></Typography>
            <Typography component="div" variant={'h4'}><Skeleton width="40%"/></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton /></Typography>
            <Typography component="div" variant={'body1'}><Skeleton width="50%"/></Typography>
          </div>
        }
      </div>
      <figure className="authorInfo">
        <Link to={`/search?author=${post?.author ? post.author : ''}`}>
          <figcaption>- Người viết:&nbsp; 
            { post ?
            post.author ?? "Vô danh"
            :
            <Typography component="div" variant={'caption'}><Skeleton width="150px"/></Typography>
            }
          </figcaption>
        </Link>
      </figure>
      <div className="tagInfo">
        <div className="tag">
          <SellIcon />
          Từ khoá:
        </div>
        <ul className="tagsList">
          { post ?
          post?.tags?.map((tag, index) => (
            <li>
              <Link to={`/search?tags=${tag}`} key={index} className="smallTag">{tag}</Link>
            </li>
          ))
          :
          <>
            <li><div className="smallTag">
              <Typography component="div" variant={'caption'}><Skeleton width="150px"/></Typography>
            </div></li>
            <li><div className="smallTag">
              <Typography component="div" variant={'caption'}><Skeleton width="60px"/></Typography>
            </div></li>
            <li><div className="smallTag">
              <Typography component="div" variant={'caption'}><Skeleton width="120px"/></Typography>
            </div></li>
          </>
          }
        </ul>
      </div>
      <ConfirmationDialog />
    </div>
  )
}
