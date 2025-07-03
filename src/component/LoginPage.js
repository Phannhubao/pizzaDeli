import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } 
    // else if (!emailRegex.test(formData.email)) {
    //   newErrors.email = 'Email không hợp lệ';
    // }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
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
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:8080/api/User/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Login successful:', data);
          // Store token if provided
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          alert('Đăng nhập thành công!');
          navigate('/'); // Redirect to homepage
        } else {
          setErrors({ general: data.message || 'Đăng nhập thất bại' });
        }
      } catch (error) {
        setErrors({ general: 'Lỗi kết nối đến server: ' + error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="vintage-register">
      <div className="vr-container">
        <div className="vr-header">
          <h1 className="vr-title">Đăng Nhập</h1>
          <p className="vr-subtitle">Đăng nhập để tận hưởng dịch vụ của Pizza Deli</p>
        </div>

        <form onSubmit={handleSubmit} className="vr-form" noValidate>
          {/* General error message */}
          {errors.general && <div className="vr-error text-center">{errors.general}</div>}

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
              placeholder="Nhập mật khẩu"
              required
            />
            {errors.password && <span className="vr-error">{errors.password}</span>}
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="vr-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>

          {/* Liên kết đăng ký */}
          <div className="vr-login-link">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;