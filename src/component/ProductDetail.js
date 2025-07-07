import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../css/detail.css";
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
   const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        
        // Fetch image separately
        const imageResponse = await axios.get(`http://localhost:8080/api/images/product/${id}`);
        const imageUrl = imageResponse.data?.[0]?.imageUrl || "img/default-product.png";
        
        setProduct({
          ...response.data,
          image: imageUrl
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

        const existingItemIndex = cart.findIndex(item => item.productId === product.productId);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, {...product, quantity}]);
    }

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng',
      text: `${quantity} ${product.productName} đã được thêm vào giỏ hàng`,
      showConfirmButton: false,
      timer: 1500,
      toast: true
    });
  };

  if (isLoading) {
    return (
      <div className="pd-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <p>Sản phẩm không tồn tại</p>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          Xem sản phẩm khác
        </button>
      </div>
    );
  }

  return (
    <div className="pd-container">
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Quay lại
      </button>
      
      <div className="pd-grid">
        <div className="pd-image-col">
          <img src={product.image} alt={product.productName} className="product-image" />
        </div>
        
        <div className="pd-info-col">
          <h1 className="pd-product-title">{product.productName}</h1>
          <p className="pd-product-price">
            {new Intl.NumberFormat('vi-VN').format(product.price)} đ
          </p>
          
          <div className="pd-section">
            <h3 className="pd-section-title">Mô tả</h3>
            <p className="pd-section-content">{product.description || "Không có mô tả"}</p>
          </div>
          
          <div className="pd-quantity-control">
            <button 
              className="pd-quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="pd-quantity-value">{quantity}</span>
            <button 
              className="pd-quantity-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          
          <button 
            className="pd-add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={!product.active}
          >
            <FaPlus /> 
            {product.active 
              ? `Thêm vào giỏ (${quantity})` 
              : "Sản phẩm tạm hết hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;