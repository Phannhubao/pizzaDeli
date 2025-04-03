import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaHome } from 'react-icons/fa';
import '../css/register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        alert('Đăng ký thành công!');
      }, 1000);
    }
  };

  return (
    <div className="vintage-register">
      <div className="vr-container">
        <div className="vr-header">
          <h1 className="vr-title">Đăng Ký Thành Viên</h1>
          <p className="vr-subtitle">Tham gia cùng Pizza Deli để nhận ưu đãi đặc biệt</p>
        </div>

        <form onSubmit={handleSubmit} className="vr-form" noValidate>
          {/* Họ và tên */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaUser className="vr-icon" />
              <span>Họ và tên</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`vr-input ${errors.name ? 'error' : ''}`}
              placeholder="Nhập họ và tên"
              required
            />
            {errors.name && <span className="vr-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaEnvelope className="vr-icon" />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`vr-input ${errors.email ? 'error' : ''}`}
              placeholder="Nhập email"
              required
            />
            {errors.email && <span className="vr-error">{errors.email}</span>}
          </div>

          {/* Số điện thoại */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaPhone className="vr-icon" />
              <span>Số điện thoại</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`vr-input ${errors.phone ? 'error' : ''}`}
              placeholder="Nhập số điện thoại"
              required
            />
            {errors.phone && <span className="vr-error">{errors.phone}</span>}
          </div>

          {/* Địa chỉ */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaHome className="vr-icon" />
              <span>Địa chỉ</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`vr-input ${errors.address ? 'error' : ''}`}
              placeholder="Nhập địa chỉ"
              required
            />
            {errors.address && <span className="vr-error">{errors.address}</span>}
          </div>

          {/* Mật khẩu */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaLock className="vr-icon" />
              <span>Mật khẩu</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`vr-input ${errors.password ? 'error' : ''}`}
              placeholder="Nhập mật khẩu (tối thiểu 8 ký tự, bao gồm chữ và số)"
              required
            />
            {errors.password && <span className="vr-error">{errors.password}</span>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="vr-form-group">
            <label className="vr-label">
              <FaLock className="vr-icon" />
              <span>Xác nhận mật khẩu</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`vr-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Nhập lại mật khẩu"
              required
            />
            {errors.confirmPassword && <span className="vr-error">{errors.confirmPassword}</span>}
          </div>

          {/* Điều khoản */}
          <div className="vr-terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">Tôi đồng ý với <a href="/terms">điều khoản và điều kiện</a></label>
          </div>

          {/* Nút đăng ký */}
          <button 
            type="submit" 
            className="vr-submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>

          {/* Liên kết đăng nhập */}
          <div className="vr-login-link">
            Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;