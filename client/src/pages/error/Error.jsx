import './error.css'
import { Link } from 'react-router-dom'
import { Container } from '@mui/material'
import useTitle from '../../hooks/useTitle';

export default function Error() {
  useTitle('Không tìm thấy trang - TAM PRODUCTION');

  return (
    <div className="errorContainer">
      <Container fluid maxWidth="lg">
        <h1 className="alternativeTitle">ÔI KHÔNG! KHÔNG THỂ TÌM THẤY TRANG NÀY.</h1>
        <p>
          Bạn có thể <Link to="/"><b className="option">TRỞ VỀ TRANG CHỦ</b></Link> 
          &nbsp;hoặc <Link to="/search"><b className="option">TÌM KIẾM BÀI VIẾT</b></Link>
        </p>
      </Container>
    </div>
  )
}
