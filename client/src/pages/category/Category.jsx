import './category.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import Post from '../../components/post/Post';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import { selectCategoryById } from '../../features/categories/categoriesApiSlice';
import { useSelector } from 'react-redux';
import useTitle from '../../hooks/useTitle';

export default function Category() {
    const { cate } = useParams();
    const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery({ cate });
    const category = useSelector(state => selectCategoryById(state, cate));
    useTitle(`${category?.name.toUpperCase()} - TAM PRODUCTION`);

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
                    <BreadCrumbs route={category?.name}/>
                    <h1 className="alternativeTitle">DANH MỤC: {category?.name.toUpperCase()}</h1>
                    {postsList}
                </Container>
            </div>
        )
    } else if (isError){
        content = <p>{error}</p>
    }

    return content;
}
