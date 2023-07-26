import './category.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';

export default function Category() {
    const { cate } = useParams();
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery(
        { cate }, 
        { refetchOnMountOrArgChange: true }
    );

    let content;
    
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = posts;

        const postsList = ids?.length
            ? ids.map(postId => {
                const post = entities[postId];
                return (<Post key={post.id} post={post}/>)
            })
            : null

        content = (
            <div className="cateContainer">
                <Container fluid maxWidth="lg">
                    <BreadCrumbs />
                    {postsList}
                </Container>
            </div>
        )
    } else if (isError){
        <p>{error}</p>
    }

    return content;
}
