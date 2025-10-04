import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import "../../css/cart.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load và theo dõi thay đổi từ localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("pizza4ps_cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log("Cart items loaded from localStorage:", parsedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          } else {
            console.warn("Parsed cart is not an array, resetting to empty:", parsedCart);
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error parsing cart data:", error);
          setCartItems([]); // Chỉ reset nếu parse thất bại
        }
      }
    };

    loadCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Lưu cart vào localStorage khi thay đổi (chỉ từ hành động người dùng)
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("pizza4ps_cart", JSON.stringify(cartItems));
      console.log("Cart updated in localStorage:", cartItems);
    }
  }, [cartItems]);

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price)
      .replace("₫", " đ");
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  // Cập nhật số lượng
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng số lượng và tổng giá
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + ((item.price || 0) * (item.quantity || 0)),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Quay lại mua sắm
          </button>
          <h1 className="cart-title">
            <FaShoppingCart /> Giỏ Hàng Của Bạn
          </h1>
          {cartItems.length > 0 && (
            <button className="clear-cart-button" onClick={clearCart}>
              <FaTrash /> Xóa tất cả
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ hàng trống</h2>
            <p>Chưa có sản phẩm nào trong giỏ hàng. Hãy thêm món ngon từ thực đơn!</p>
            <Link to="/" className="shop-button">
              Khám phá thực đơn
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="item-image">
                    <img
                      src={
                        item.image?.startsWith("../")
                          ? item.image.substring(2)
                          : item.image || "img/default-product.png"
                      }
                      alt={item.productName || "Hình ảnh sản phẩm"}
                      className="item-img"
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.productName || "Tên sản phẩm"}</h3>
                    {item.tag && <span className="item-tag">{item.tag}</span>}
                    <p className="item-price">{formatPrice(item.price || 0)}</p>
                    <div className="item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-value">{item.quantity || 1}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="item-total">{formatPrice((item.price || 0) * (item.quantity || 0))}</div>
                  <button className="remove-item" onClick={() => removeFromCart(item.productId)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="summary-title">Tổng Quan Đơn Hàng</h3>
              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
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
                Thanh Toán Ngay
              </Link>
              <p className="shipping-note">* Phí vận chuyển sẽ được tính khi thanh toán</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;