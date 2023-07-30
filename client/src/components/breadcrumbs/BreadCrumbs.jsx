import './breadcrumbs.css'
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useSelector } from 'react-redux';
import { selectCategoryById } from '../../features/categories/categoriesApiSlice';

export default function BreadCrumbs({ route, post }) {
  const category = useSelector(state => selectCategoryById(state, post?.category));

  const breadcrumbs = [
    <Link
      className="home-crumb"
      to="/"
    >
      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    </Link>
  ];

  if (route) {
    breadcrumbs.push(
      <Typography
        className="crumb"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
      >
        {route}
      </Typography>
    )
  } else if (post) {
    breadcrumbs.push(
      <Link
        className="crumb"
        to={`/category/${category?.type}`}
      >
        {category?.name}
      </Link>
      ,
      <Typography
        className="crumb"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
      >
        {post?.title}
      </Typography>
    )
  }


  return (
    <div className="breadCrumbsContainer">
      <Breadcrumbs aria-label="breadcrumb" 
        className="breadcrumbs" 
        separator={<span className="crumb-seperator">&nbsp;</span>}
      >
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  )
}
