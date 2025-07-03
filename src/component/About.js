import React from 'react';
import {   FaStore } from 'react-icons/fa';
import '../css/about.css';

const About = () => {
  return (
    <div className="vintage-about">
      <div className="va-hero">
        <div className="va-hero-content">
          <h1 className="va-title">Câu Chuyện Của Chúng Tôi</h1>
          <p className="va-subtitle">Từ năm 1985 với tình yêu ẩm thực Ý truyền thống</p>
        </div>
      </div>

      <div className="va-container">
      

        <section className="va-values-section">
        
          <div className="va-values-grid">
            <div className="va-value-card">
              <h3>Truyền Thống</h3>
              <p>Giữ trọn vẹn hương vị ẩm thực Ý nguyên bản với công thức được bảo tồn qua nhiều thế hệ.</p>
            </div>
            <div className="va-value-card">
              <h3>Chất Lượng</h3>
              <p>Nguyên liệu nhập khẩu trực tiếp từ Ý kết hợp với nguồn nguyên liệu địa phương tươi ngon nhất.</p>
            </div>
            <div className="va-value-card">
              <h3>Sáng Tạo</h3>
              <p>Không ngừng đổi mới để mang đến trải nghiệm ẩm thực độc đáo cho thực khách.</p>
            </div>
          </div>
        </section>

        <section className="va-team-section">
          <div className="va-section-header">
            <FaStore className="va-section-icon" />
            <h2 className="va-section-title">Đội Ngũ Của Chúng Tôi</h2>
          </div>
          <div className="va-team-grid">
            <div className="va-team-member">
              <div className="va-member-image" style={{ backgroundImage: 'url(img/tacgia.jpg)' }}></div>
              <h3>Marco Rossi</h3>
              <p>Bếp trưởng người Ý</p>
            </div>
            <div className="va-team-member">
              <div className="va-member-image" style={{ backgroundImage: 'url(img/tacgia.jpg)' }}></div>
              <h3>Marco Rossi</h3>
              <p>Quản lý chất lượng</p>
            </div>
            <div className="va-team-member">
              <div className="va-member-image" style={{ backgroundImage: 'url(img/tacgia.jpg)' }}></div>
              <h3>Marco Rossi</h3>
              <p>Chuyên gia ủ bột</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;