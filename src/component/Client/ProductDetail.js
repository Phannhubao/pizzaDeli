import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import "../../css/detail.css";
import Swal from "sweetalert2";
import { Domain } from "../../services/Domain";
import { useCart } from "../../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${Domain}/api/products/${id}`);
        
        // Fetch image separately
        const imageResponse = await axios.get(`${Domain}/api/images/product/${id}`);
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

    addToCart(product, quantity);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Đã thêm vào giỏ hàng",
      text: `${quantity} ${product.productName || product.name || 'sản phẩm'} đã được thêm vào giỏ hàng`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: "#f8f9fa",
      iconColor: "#28a745",
    });
  };

  // const updateQuantityInCart = (productId, newQuantity) => {
  //   if (newQuantity < 1) {
  //     removeFromCart(productId);
  //     return;
  //   }
  //   const updatedCart = cart.map((item) =>
  //     item.productId === productId ? { ...item, quantity: newQuantity } : item
  //   );
  //   setCart(updatedCart);
  //   localStorage.setItem("pizza4ps_cart", JSON.stringify(updatedCart));
  // };

  // const removeFromCart = (productId) => {
  //   const updatedCart = cart.filter((item) => item.productId !== productId);
  //   setCart(updatedCart);
  //   localStorage.setItem("pizza4ps_cart", JSON.stringify(updatedCart));
  // };

  // const clearCart = () => {
  //   setCart([]);
  //   localStorage.removeItem("pizza4ps_cart");
  // };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
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
          <p className="pd-product-price">{formatPrice(product.price)}</p>
          
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
              <FaMinus />
            </button>
            <span className="pd-quantity-value">{quantity}</span>
            <button 
              className="pd-quantity-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              <FaPlus />
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

      {/* Phần hiển thị giỏ hàng */}
      {/* {cart.length > 0 && (
        <div className="pd-cart-section">
          <h2 className="pd-cart-title">Giỏ Hàng Của Bạn</h2>
          <div className="pd-cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="pd-cart-item">
                <div className="pd-cart-item-image">
                  <img
                    src={item.image || "img/default-product.png"}
                    alt={item.productName || "Hình ảnh sản phẩm"}
                    className="pd-cart-item-img"
                  />
                </div>
                <div className="pd-cart-item-details">
                  <h3 className="pd-cart-item-name">{item.productName || "Tên sản phẩm"}</h3>
                  <p className="pd-cart-item-price">{formatPrice(item.price || 0)}</p>
                  <div className="pd-cart-quantity-control">
                    <button
                      className="pd-cart-quantity-btn"
                      onClick={() => updateQuantityInCart(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="pd-cart-quantity-value">{item.quantity}</span>
                    <button
                      className="pd-cart-quantity-btn"
                      onClick={() => updateQuantityInCart(item.productId, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="pd-cart-item-total">{formatPrice((item.price || 0) * item.quantity)}</div>
                <button
                  className="pd-cart-remove-btn"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="pd-cart-summary">
            <p className="pd-cart-total">
              Tổng cộng: <strong>{formatPrice(cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0))}</strong>
            </p>
            <button className="pd-cart-clear-btn" onClick={clearCart}>
              <FaTrash /> Xóa tất cả
            </button>
            <button className="pd-cart-checkout-btn" onClick={() => navigate("/cart")}>
              Xem giỏ hàng
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductDetail;