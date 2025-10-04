import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/footer.css";
import { FaFacebook, FaInstagram, FaSpotify } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-light text-dark pt-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <h5 className="font-weight-bold">PIZZA DELI</h5>
            <p>Công ty cổ phần PIZZA Deli</p>
            <p>Địa chỉ</p>
            <p>
              17 Lê Thánh Tôn, Bến Nghé, quận 1,
              <br />
              thành phố Hồ Chí Minh
            </p>
            <p>Gọi vào Đường Dây Nóng để được hỗ trợ thêm</p>
            <p>19006043</p>
          </div>
          <div className="col-lg-4">
            <h5 className="font-weight-bold">Giấy chứng nhận CSĐĐKATTP</h5>
            <p>
              Số 2895/2018/ATTP-CNDK do Ban Quản lý An
              <br />
              toàn thực phẩm thành phố Hồ Chí Minh cấp ngày
              <br />
              05/07/2018
            </p>
            <h5 className="font-weight-bold">Giấy chứng nhận ĐKKD</h5>
            <p>
              Số 0313168515 do Sở Kế Hoạch và Đầu tư cấp
              <br />
              ngày 19/03/2015
            </p>
          </div>
          <div className="col-lg-4">
            <h5 className="font-weight-bold">Chính sách & Quy định</h5>
            <ul className="list-unstyled">
              <li>Chính sách & quy định chung</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách & Quy định E-Voucher</li>
            </ul>
            <h5 className="font-weight-bold">Dịch vụ khách hàng</h5>
            <ul className="list-unstyled">
              <li>Chính sách giao hàng</li>
              <li>Chính sách đổi trả và hoàn tiền</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <h6>Theo dõi chúng tôi trên mạng xã hội</h6>
          <a href="/" className="mx-2">
            <FaFacebook />
          </a>
          <a href="/" className="mx-2">
            <FaInstagram />
          </a>
          <a href="/" className="mx-2">
            <FaSpotify />
          </a>
        </div>
        <div className="text-center mt-4">
          <p>Bản quyền © 2025 Pizza Deli. Đã đăng ký Bản quyền</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
