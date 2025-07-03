import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import '../css/cart.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza4ps_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Lưu cart vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('pizza4ps_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // Thêm sản phẩm vào giỏ hàng
  // const addToCart = (product, quantity = 1) => {
  //   setCartItems(prevItems => {
  //     const existingItem = prevItems.find(item => item.id === product.id);
      
  //     if (existingItem) {
  //       return prevItems.map(item =>
  //         item.id === product.id 
  //           ? { ...item, quantity: item.quantity + quantity }
  //           : item
  //       );
  //     }
      
  //     return [...prevItems, { ...product, quantity }];
  //   });
  // };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng số lượng sản phẩm
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Tiếp tục mua sắm
          </button>
          <h1 className="cart-title">
            <FaShoppingCart /> Giỏ Hàng Của Bạn
          </h1>
          {cartItems.length > 0 && (
            <button className="clear-cart-button" onClick={clearCart}>
              <FaTrash /> Xóa giỏ hàng
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy khám phá thực đơn và thêm món ngon vào giỏ hàng!</p>
            <Link to="/" className="shop-button">
              Xem thực đơn
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image.startsWith('../') ? item.image.substring(2) : item.image} 
                         alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    {item.tag && <span className="item-tag">{item.tag}</span>}
                    <p className="item-price">{formatPrice(item.price)}</p>
                    
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>
              
              <div className="summary-row">
                <span>Tổng sản phẩm:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <Link to="/checkout" className="checkout-button">
                Tiến Hành Thanh Toán
              </Link>

              <p className="shipping-note">
                * Phí vận chuyển sẽ được tính ở bước thanh toán
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;