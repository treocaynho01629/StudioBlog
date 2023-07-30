import './video.css';
import { Container } from '@mui/material';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import YoutubeList from '../../components/youtube-list/YoutubeList';
import useTitle from '../../hooks/useTitle';

export default function Video() {
  useTitle("VIDEO - TAM PRODUCTION");

  return (
    <div className="videoContainer">
        <Container fluid maxWidth="lg">
            <BreadCrumbs route="Video" />
            <div className="container">
                <h1 className="alternativeTitle">VIDEO NỔI BẬT</h1>
                <YoutubeList amount={10} refetchOnMountOrArgChange={true}/>
            </div>
        </Container>
    </div>
  )
}
