import './about.css';
import { Container } from '@mui/material';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import { marked } from 'marked';
import useTitle from '../../hooks/useTitle';

const markdown = `
<span style="color:orange">**TAM PRODUCTION**</span> là một đơn vị Quay Phim – Chụp Ảnh chuyên nghiệp tại Đà Lạt. Lấy sự hài lòng của khách hàng làm chuẩn mực xây dựng dịch vụ, luôn lắng nghe, thấu hiểu, tận tâm.

Các dịch vụ **chụp ảnh, quay phim Đà Lạt** do <span style="color:orange">**TAM PRODUCTION**</span> cung cấp bao gồm:

- Dịch vụ quay phim chụp ảnh sự kiện.
- Dịch vụ quay phim, chụp ảnh ngoại cảnh ( pre-wedding).
- Dịch vụ quay phim ngày cưới.
- Dịch vụ quay phim TVC, phim giới thiệu doanh nghiệp.
- Dịch vụ cho thuê flycam.
- Dịch vụ livestream.

Đà Lạt – thành phố sương mù nhiều khung cảnh thơ mộng là địa điểm lý tưởng cho các dự án **TAM PRODUCTION**. Nếu bạn đang có nhu cầu, có một số yếu tố bạn nên xem xét:

- Đội ngũ Ekip chuyên nghiệp.
- Phong cách cung cấp dịch vụ.
- Bảng giá thuê cạnh tranh.
- Dịch vụ sau khi quay phim.
-- Đánh giá và phản hồi.
#### Tại sao nên chọn dịch vụ chụp hình, quay phim tại Đà Lạt của TAM PRODUCTION

**TAM PRODUCTION** là đơn vị chuyên cung cấp dịch vụ quay phim và chụp hình chuyên nghiệp tại Đà Lạt. Với nhiều năm kinh nghiệm trong lĩnh vực này, chúng tôi đã tạo dựng được niềm tin và sự hài lòng của khách hàng trên khắp Đà Lạt và các vùng lân cận.

Chúng tôi sở hữu đội ngũ nhân viên giàu kinh nghiệm và đam mê với công việc. Ngoài ra, chúng tôi còn sở hữu thiết bị quay phim, chụp hình hiện đại, bắt trọn kỉ niệm đáng nhớ cho khách hàng.

Với sự tận tâm và nhiệt huyết, <span style="color:darkblue">**TAM PRODUCTION**</span> cam kết sẽ đáp ứng mọi yêu cầu của khách hàng về dịch vụ chụp hình, quay phim Đà Lạt mang đến những sản phẩm chất lượng cao, đẳng cấp nhất.
`

export default function About() {
  useTitle("Về chúng tôi - TAM PRODUCTION");

  return (
    <div className="aboutContainer">
      <Container fluid maxWidth="lg">
        <BreadCrumbs route="Giới thiệu" />
        <h1 className="alternativeTitle">GIỚI THIỆU VỀ TAM PRODUCTION</h1>
        <div className="aboutMarkdown" dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} />
      </Container>
    </div>
  )
}
