import Carousel from 'react-bootstrap/Carousel';
import '../css/banner.css'

function Banner() {
  return (
    <Carousel fade>
      <Carousel.Item>
      <img src='img/banner1.jpg' alt=''   />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src='img/banner2.jpg' alt=''   />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src='img/banner3.jpg' alt=''   />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Banner;