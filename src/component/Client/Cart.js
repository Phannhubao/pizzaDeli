import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import "../../css/cart.css";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price || 0)
      .replace("₫", " đ");
  };

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
              {cartItems.map((item) => {
                const itemId = item.productId ?? item.id;
                return (
                  <div key={itemId} className="cart-item">
                    <div className="item-image">
                      <img
                        src={
                          item.image?.startsWith("../")
                            ? item.image.substring(2)
                            : item.image || "img/default-product.png"
                        }
                        alt={item.productName || item.name || "Hình ảnh sản phẩm"}
                        className="item-img"
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.productName || item.name || "Tên sản phẩm"}</h3>
                      {item.tag && <span className="item-tag">{item.tag}</span>}
                      <p className="item-price">{formatPrice(item.price || 0)}</p>
                      <div className="item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity-value">{item.quantity || 1}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div className="item-total">{formatPrice((item.price || 0) * (item.quantity || 0))}</div>
                    <button className="remove-item" onClick={() => removeFromCart(itemId)}>
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
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