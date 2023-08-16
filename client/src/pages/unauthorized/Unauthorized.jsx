import './unauthorized.css'
import { Container } from '@mui/material'
import { Link } from 'react-router-dom'
import useTitle from '../../hooks/useTitle';

export default function Unauthorized() {
  useTitle('Từ chối truy cập - TAM PRODUCTION');

  return (
    <div className="unauthContainer">
      <Container fluid maxWidth="lg">
        <h1 className="alternativeTitle">ÔI KHÔNG! BẠN KHÔNG CÓ QUYỀN TRUY CẬP TRANG NÀY.</h1>
        <p>
          Bạn có thể <Link to="/"><b className="option">TRỞ VỀ TRANG CHỦ</b></Link>
          &nbsp;hoặc <Link to="/manage"><b className="option">VỀ TRANG QUẢN LÝ</b></Link>
        </p>
      </Container>
    </div>
  )
}
