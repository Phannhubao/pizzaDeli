import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart, FaTicketAlt, FaCheckCircle, FaTimes } from "react-icons/fa";
import "../../css/cart.css";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalPrice,
    applyCoupon,
    removeCoupon,
    availableCoupons
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price || 0)
      .replace("₫", " đ");
  };

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code || !code.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Chưa nhập mã",
        text: "Vui lòng nhập mã giảm giá để áp dụng!",
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
      return;
    }

    setIsApplying(true);
    const result = await applyCoupon(code);
    setIsApplying(false);

    if (result.success) {
      setCouponInput("");
      Swal.fire({
        icon: "success",
        title: "Áp dụng thành công!",
        text: result.message,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Không thể áp dụng",
        text: result.message,
        confirmButtonColor: "#c9a66b"
      });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    Swal.fire({
      icon: "info",
      title: "Đã hủy mã giảm giá",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
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
            <Link to="/products" className="shop-button">
              Khám phá thực đơn
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Cột danh sách món */}
            <div className="cart-items-section">
              <div className="cart-items">
                {cartItems.map((item) => {
                  const itemId = item.cartItemId || item.productId || item.id;
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

                        {/* Nhãn tùy chỉnh món (Size / Đế / Topping / Ghi chú) */}
                        {item.optionTags && item.optionTags.length > 0 && (
                          <div className="cart-item-tags">
                            {item.optionTags.map((tag, idx) => (
                              <span key={idx} className="option-tag-pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

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
                      <div className="item-total">
                        {formatPrice((item.price || 0) * (item.quantity || 0))}
                      </div>
                      <button
                        className="remove-item"
                        title="Xóa món này"
                        onClick={() => removeFromCart(itemId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* KHỐI MÃ GIẢM GIÁ (COUPON BOX) */}
              <div className="cart-coupon-card">
                <div className="coupon-header">
                  <FaTicketAlt className="coupon-icon" />
                  <h4>Mã Giảm Giá & Voucher Khuyến Mãi</h4>
                </div>

                {appliedCoupon ? (
                  <div className="applied-coupon-banner">
                    <div className="applied-info">
                      <FaCheckCircle className="check-icon" />
                      <div>
                        <strong>Mã: {appliedCoupon.code}</strong> - {appliedCoupon.description || appliedCoupon.title}
                        <div className="text-success small">
                          Đã giảm: -{formatPrice(discountAmount)}
                        </div>
                      </div>
                    </div>
                    <button className="btn-remove-coupon" onClick={handleRemoveCoupon} title="Hủy mã">
                      <FaTimes /> Gỡ
                    </button>
                  </div>
                ) : (
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      className="form-control coupon-input"
                      placeholder="Nhập mã ưu đãi (Ví dụ: PIZZA50)..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <button
                      className="btn-apply-coupon"
                      onClick={() => handleApplyCoupon()}
                      disabled={isApplying}
                    >
                      {isApplying ? "Đang kiểm tra..." : "Áp Dụng"}
                    </button>
                  </div>
                )}

                {/* Danh sách các voucher có sẵn để click nhanh */}
                <div className="available-vouchers-box mt-3">
                  <span className="vouchers-title">Gợi ý mã ưu đãi hot từ Deli API:</span>
                  <div className="voucher-chips-list">
                    {availableCoupons.map((c) => {
                      const isCurrentlyApplied = appliedCoupon?.code === c.code;
                      return (
                        <div
                          key={c.code}
                          className={`voucher-chip ${isCurrentlyApplied ? "applied" : ""}`}
                          onClick={() => !isCurrentlyApplied && handleApplyCoupon(c.code)}
                        >
                          <span className="chip-code">{c.code}</span>
                          <span className="chip-desc">{c.title || c.description}</span>
                          {c.badge && <span className="chip-badge">{c.badge}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Cột tóm tắt đơn hàng */}
            <div className="cart-summary-col">
              <div className="cart-summary">
                <h3 className="summary-title">Tổng Quan Đơn Hàng</h3>
                <div className="summary-row">
                  <span>Số lượng món:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                {appliedCoupon && (
                  <div className="summary-row discount-row text-success">
                    <span>
                      Giảm giá ({appliedCoupon.code}):
                    </span>
                    <strong>-{formatPrice(discountAmount)}</strong>
                  </div>
                )}

                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span>{appliedCoupon?.discountType === 'SHIPPING' ? <s className="text-muted">{formatPrice(30000)}</s> : formatPrice(0)}</span>
                </div>

                <div className="summary-total">
                  <span>Tổng thanh toán:</span>
                  <span className="total-amount-highlight">{formatPrice(finalPrice)}</span>
                </div>

                <Link to="/checkout" className="checkout-button">
                  Tiến Hành Thanh Toán
                </Link>
                <p className="shipping-note">* Đã hỗ trợ đồng bộ mã giảm giá sang trang thanh toán</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;