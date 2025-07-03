import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import '../css/contact.css';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
  };

  return (
    <div className="vintage-contact">
      {/* Header Section */}
      <div className="vc-hero">
        <h1 className="vc-hero-title">Liên Hệ Với Deli</h1>
        <p className="vc-hero-subtitle">Chúng tôi luôn lắng nghe ý kiến của bạn</p>
      </div>

      {/* Contact Information */}
      <div className="vc-container">
        <div className="vc-row">
          {/* Contact Info */}
          <div className="vc-info-col">
            <div className="vc-info-card">
              <FaMapMarkerAlt className="vc-icon" />
              <h3>Địa chỉ</h3>
              <p>8/15 Lê Thánh Tôn, Quận 1, TP.HCM</p>
            </div>

            <div className="vc-info-card">
              <FaPhone className="vc-icon" />
              <h3>Điện thoại</h3>
              <p>0336040785</p>
            </div>

            <div className="vc-info-card">
              <FaEnvelope className="vc-icon" />
              <h3>Email</h3>
              <p>deli@gmail.com</p>
            </div>

            <div className="vc-info-card">
              <FaClock className="vc-icon" />
              <h3>Giờ mở cửa</h3>
              <p>Thứ 2 - CN: 10:00 - 22:00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="vc-form-col">
            <h2 className="vc-form-title">Gửi tin nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit} className="vc-form">
              <div className="vc-form-group">
                <input 
                  type="text" 
                  placeholder="Họ và tên" 
                  className="vc-input" 
                  required 
                />
              </div>
              <div className="vc-form-group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="vc-input" 
                  required 
                />
              </div>
              <div className="vc-form-group">
                <input 
                  type="tel" 
                  placeholder="Số điện thoại" 
                  className="vc-input" 
                />
              </div>
              <div className="vc-form-group">
                <textarea 
                  placeholder="Nội dung tin nhắn..." 
                  className="vc-textarea" 
                  rows="5" 
                  required
                ></textarea>
              </div>
              <button type="submit" className="vc-submit-btn">
                <FaPaperPlane /> Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>

     
      <div className="vc-map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193593550936!2d106.70182631526039!3d10.786837661739767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a7d18c51b%3A0x5ccd6b551b1a6a09!2sPizza%204P&#39;s!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s" 
          className="vc-map"
          allowFullScreen
          loading="lazy"
          title="Pizza Deli Location"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;