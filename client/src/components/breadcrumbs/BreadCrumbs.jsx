import './breadcrumbs.css'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export default function BreadCrumbs() {
  return (
    <div className="breadCrumbsContainer">
        <Breadcrumbs aria-label="breadcrumb">
            <Link
            className="crumb"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="/"
            >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            </Link>
            <Link
            className="crumb"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="/"
            >
            TIN TỨC
            </Link>
            <Typography
            className="crumb"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
            >
            TEAM BUILDING LÀ GÌ? KHÁM PHÁ GIÁ TRỊ CỦA “LIỀU THUỐC” TEAM BUILDING
            </Typography>
        </Breadcrumbs>
    </div>
  )
}
