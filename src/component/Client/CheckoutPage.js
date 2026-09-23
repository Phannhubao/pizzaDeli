import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaSpinner, FaTag } from "react-icons/fa";
import axios from "axios";
import CryptoJS from "crypto-js";
import '../../css/checkout.css';
import Swal from "sweetalert2"; 
import { useCart } from "../../context/CartContext";
import { Domain } from "../../services/Domain";

// Hàm format datetime theo chuẩn VNPay (yyyyMMddHHmmss, GMT+7)
const formatDateVN = (date) => {
  const tzOffset = 7 * 60 * 60000; // GMT+7
  const localDate = new Date(date.getTime() + tzOffset);

  const yyyy = localDate.getUTCFullYear();
  const MM = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(localDate.getUTCDate()).padStart(2, "0");
  const HH = String(localDate.getUTCHours()).padStart(2, "0");
  const mm = String(localDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(localDate.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};

// Hàm lấy base URL động
const getBaseUrl = () => {
  return window.location.origin;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalItems,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalPrice,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    createdAt: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");


  // Thông tin VNPay
  const vnpayConfig = {
    tmnCode: "2EYSS84X", 
    secretKey: "AT2JO218AOV4EHRYFUC7GW9FF755NBEL", 
    vnpayUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: `${getBaseUrl()}/vnpay-return`
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.fullName || currentUser.username) {
      setCustomerInfo(prev => ({
        ...prev,
        fullName: currentUser.fullName || currentUser.username,
        email: currentUser.email || ""
      }));
    }

    // Chỉ chuyển về giỏ hàng khi chưa hoàn thành đặt hàng và giỏ hàng trống
    if (!orderSuccess && (!cartItems || cartItems.length === 0)) {
      navigate("/cart");
    }
  }, [navigate, cartItems, orderSuccess]);

  const formatPrice = price =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price || 0)
      .replace("₫", " đ");

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!customerInfo.fullName.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập họ tên", "error");
      return false;
    }
    if (!customerInfo.phone.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập số điện thoại", "error");
      return false;
    }
    if (!customerInfo.address.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập địa chỉ giao hàng", "error");
      return false;
    }
    return true;
  };

  // Hàm tạo checksum VNPay dùng crypto-js
  const createVnpayChecksum = (params, secretKey) => {
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        result[key] = params[key];
      }
      return result;
    }, {});
    
    const signData = new URLSearchParams(sortedParams).toString();
    return CryptoJS.HmacSHA512(signData, secretKey).toString();
  };

  // Hàm tạo đơn hàng CHỈ DÙNG CHO COD
  const createOrderForCOD = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = currentUser.id || currentUser.userId;
    const currentTime = new Date().toISOString();
    const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

    try {
      // 1. Tạo đơn hàng với mã giảm giá và tùy chọn
      const orderData = {
        phone_number: customerInfo.phone,
        address: customerInfo.address,
        username: currentUser.username || customerInfo.fullName,
        quantity: totalQuantity,
        totalPrice: finalPrice, // Số tiền sau khi đã trừ giảm giá
        voucherCode: appliedCoupon?.code || null,
        discountAmount: discountAmount || 0,
        image: cartItems[0]?.image || "img/default-product.png",
        userId: userId,
        createdAt: currentTime
      };

      const orderRes = await axios.post(`${Domain}/api/Order/AddOrder`, orderData, {
        headers: { "Content-Type": "application/json" }
      });

      // 2. Lấy orderId
      let orderId = null;
      if (orderRes.data?.orderId) {
        orderId = orderRes.data.orderId;
      } else if (orderRes.data?.id) {
        orderId = orderRes.data.id;
      } else if (orderRes.data?.OrderId) {
        orderId = orderRes.data.OrderId;
      } else if (orderRes.data?.data?.orderId) {
        orderId = orderRes.data.data.orderId;
      } else if (typeof orderRes.data === "number") {
        orderId = orderRes.data;
      }

      if (!orderId || isNaN(orderId)) {
        throw new Error("Không nhận được ID đơn hàng hợp lệ từ server");
      }
      orderId = Number(orderId);

      // 3. Tạo OrderDetail kèm options và note
      const orderDetailList = cartItems.map(item => ({
        quantity: item.quantity || 1,
        price: item.price || 0,
        produc_name: item.productName || item.name || "Unknown Product",
        options: item.optionTags && item.optionTags.length > 0 ? item.optionTags.join(' | ') : null,
        note: item.options?.note || null,
        image: item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png",
        orderId: orderId,
        productId: item.productId || item.id,
        canFeedBack: false
      }));

      await axios.post(`${Domain}/api/OrderDeTail/AddOrderDetailList`, orderDetailList, {
        headers: { "Content-Type": "application/json" }
      });

      // 4. Gửi thông tin thanh toán (COD = false)
      const paymentData = {
        orderId: orderId,
        fullname: customerInfo.fullName,
        status: false // COD chưa thanh toán
      };
      await axios.post(`${Domain}/api/Payment/AddPayment`, paymentData, {
        headers: { "Content-Type": "application/json" }
      });

      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser || !currentUser.token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập!",
        text: "Vui lòng đăng nhập để tiếp tục đặt hàng.",
        confirmButtonText: "Đăng nhập ngay",
        confirmButtonColor: "#c9a66b",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!validateForm()) return;
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        // Thanh toán COD: tạo đơn hàng ngay
        const createdOrderId = await createOrderForCOD();
        
        // Lưu lại bản tóm tắt đơn hàng trước khi clear cart
        const summary = {
          orderId: createdOrderId,
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          finalPrice: finalPrice,
          discountAmount: discountAmount,
          voucherCode: appliedCoupon?.code || null
        };
        setCompletedOrder(summary);
        setOrderSuccess(true);
        clearCart();
        window.scrollTo(0, 0);

        // Hiển thị thông báo đặt hàng thành công
        Swal.fire({
          icon: "success",
          title: "Đặt Hàng Thành Công!",
          html: `
            <div style="font-size: 15px; text-align: left; margin-top: 10px; line-height: 1.6;">
              <p style="margin-bottom: 6px;"><b>Mã đơn hàng:</b> <span style="color: #c9a66b; font-weight: bold;">#${createdOrderId}</span></p>
              <p style="margin-bottom: 6px;"><b>Người nhận:</b> ${customerInfo.fullName}</p>
              <p style="margin-bottom: 6px;"><b>Số điện thoại:</b> ${customerInfo.phone}</p>
              <p style="margin-bottom: 6px;"><b>Địa chỉ:</b> ${customerInfo.address}</p>
              <p style="margin-bottom: 6px;"><b>Tổng thanh toán:</b> <span style="color: #e53935; font-weight: bold;">${formatPrice(finalPrice)}</span></p>
              <p style="margin-bottom: 0;"><b>Hình thức:</b> Thanh toán khi nhận hàng (COD)</p>
            </div>
          `,
          confirmButtonText: "Xem Đơn Hàng Của Bạn",
          confirmButtonColor: "#28a745",
          showCancelButton: true,
          cancelButtonText: "Tiếp Tục Mua Sắm",
          cancelButtonColor: "#c9a66b",
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/profile");
          }
        });
        
      } else if (paymentMethod === "BANK_TRANSFER") {
        // Thanh toán VNPay
        const transactionId = `VNPAY_${Date.now()}`;
        
        const vnpParams = {
          vnp_Version: '2.1.0',
          vnp_Command: 'pay',
          vnp_TmnCode: vnpayConfig.tmnCode,
          vnp_Amount: Math.round(finalPrice * 100), // Số tiền sau giảm giá
          vnp_CurrCode: 'VND',
          vnp_TxnRef: transactionId,
          vnp_OrderInfo: `Thanh toan don hang ${transactionId}`,
          vnp_OrderType: 'billpayment',
          vnp_Locale: 'vn',
          vnp_ReturnUrl: vnpayConfig.returnUrl,
          vnp_IpAddr: '127.0.0.1',
          vnp_CreateDate: formatDateVN(new Date()),
          vnp_ExpireDate: formatDateVN(new Date(Date.now() + 15 * 60 * 1000))
        };

        const secureHash = createVnpayChecksum(vnpParams, vnpayConfig.secretKey);
        
        const vnpUrl = new URL(vnpayConfig.vnpayUrl);
        Object.keys(vnpParams).forEach(key => {
          vnpUrl.searchParams.append(key, vnpParams[key]);
        });
        vnpUrl.searchParams.append('vnp_SecureHash', secureHash);

        // Lưu thông tin đơn hàng tạm thời kèm voucher để sử dụng khi trả về
        const pendingOrder = {
          customerInfo,
          cartItems,
          totalPrice: finalPrice,
          originalPrice: totalPrice,
          discountAmount,
          voucherCode: appliedCoupon?.code || null,
          totalItems,
          paymentMethod,
          transactionId: transactionId,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("pending_vnpay_order", JSON.stringify(pendingOrder));
        
        // Chuyển hướng sang cổng thanh toán VNPay
        window.location.href = vnpUrl.toString();
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      Swal.fire("Lỗi", `Có lỗi xảy ra: ${err.response?.data?.message || err.message}. Vui lòng thử lại!`, "error");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    const displayOrder = completedOrder || {
      orderId: "",
      fullName: customerInfo.fullName,
      phone: customerInfo.phone,
      address: customerInfo.address,
      finalPrice: finalPrice,
      discountAmount: discountAmount,
      voucherCode: appliedCoupon?.code
    };

    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Đặt Hàng Thành Công!</h2>
            <p>Cảm ơn bạn đã đặt món tại Pizza Deli. Đơn hàng của bạn đang được bếp chế biến.</p>
            {displayOrder.voucherCode && (
              <div className="alert alert-success d-inline-block mt-2">
                <FaTag /> Bạn đã tiết kiệm <strong>{formatPrice(displayOrder.discountAmount)}</strong> với mã <strong>{displayOrder.voucherCode}</strong>!
              </div>
            )}
            <div className="order-info">
              {displayOrder.orderId && (
                <p><strong>Mã đơn hàng:</strong> <span style={{ color: "#c9a66b", fontWeight: "bold" }}>#{displayOrder.orderId}</span></p>
              )}
              <p><strong>Người nhận:</strong> {displayOrder.fullName}</p>
              <p><strong>Số điện thoại:</strong> {displayOrder.phone}</p>
              <p><strong>Địa chỉ:</strong> {displayOrder.address}</p>
              <p><strong>Phương thức:</strong> Thanh toán khi nhận hàng (COD)</p>
              <p><strong>Tổng thanh toán:</strong> <span className="text-danger fw-bold">{formatPrice(displayOrder.finalPrice)}</span></p>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              <button className="continue-shopping" onClick={() => navigate("/")}>
                Tiếp Tục Mua Sắm
              </button>
              <button 
                className="continue-shopping" 
                style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                onClick={() => navigate("/profile")}
              >
                Xem Đơn Hàng Của Bạn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-button" onClick={() => navigate("/cart")}>
            <FaArrowLeft /> Quay lại giỏ hàng
          </button>
          <h1 className="checkout-title"><FaShoppingCart /> Thanh Toán Đơn Hàng</h1>
        </div>

        <div className="checkout-content">
          {/* Thông tin khách hàng */}
          <div className="checkout-section">
            <h3 className="section-title"><FaUser /> Thông Tin Khách Hàng</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input type="text" name="fullName" value={customerInfo.fullName}
                  onChange={handleInputChange} placeholder="Nhập họ và tên" required />
              </div>
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" name="phone" value={customerInfo.phone}
                  onChange={handleInputChange} placeholder="Nhập số điện thoại" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={customerInfo.email}
                  onChange={handleInputChange} placeholder="Nhập email (không bắt buộc)" />
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="checkout-section">
            <h3 className="section-title"><FaMapMarkerAlt /> Địa Chỉ Giao Hàng</h3>
            <div className="form-group">
              <label>Địa chỉ *</label>
              <textarea name="address" value={customerInfo.address}
                onChange={handleInputChange} placeholder="Nhập địa chỉ giao hàng chi tiết"
                rows="3" required />
            </div>
            <div className="form-group">
              <label>Ghi chú</label>
              <textarea name="note" value={customerInfo.note}
                onChange={handleInputChange} placeholder="Ghi chú thêm cho shipper (không bắt buộc)"
                rows="2" />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="checkout-section">
            <h3 className="section-title"><FaCreditCard /> Phương Thức Thanh Toán</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input type="radio" name="paymentMethod" value="COD"
                  checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="paymentMethod" value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Thanh toán online qua VNPay (Sandbox)</span>
              </label>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="checkout-section">
            <h3 className="section-title">Tóm Tắt Đơn Hàng ({totalItems} món)</h3>
            <div className="order-items">
              {cartItems.map((item, idx) => {
                const itemId = item.cartItemId || item.productId || idx;
                return (
                  <div key={itemId} className="order-item">
                    <div className="item-info">
                      <img src={item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png"}
                        alt={item.productName || item.name} className="item-thumb" />
                      <div>
                        <h4>{item.productName || item.name}</h4>
                        {item.optionTags && item.optionTags.length > 0 && (
                          <div className="checkout-options-tags my-1">
                            {item.optionTags.map((opt, i) => (
                              <span key={i} className="badge bg-light text-dark border me-1 small">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="item-quantity">Số lượng: x{item.quantity || 1}</span>
                      </div>
                    </div>
                    <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
                  </div>
                );
              })}
            </div>

            <div className="order-summary">
              <div className="summary-row"><span>Số lượng:</span><span>{totalItems} phần</span></div>
              <div className="summary-row"><span>Tạm tính:</span><span>{formatPrice(totalPrice)}</span></div>
              {appliedCoupon && (
                <div className="summary-row text-success fw-bold">
                  <span>Mã giảm giá ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row"><span>Phí vận chuyển:</span><span>{appliedCoupon?.discountType === 'SHIPPING' ? 'Miễn phí (Đã áp voucher)' : 'Miễn phí'}</span></div>
              <div className="summary-total"><span>Tổng thanh toán:</span><span className="text-warning fs-4">{formatPrice(finalPrice)}</span></div>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
              {loading ? (<><FaSpinner className="spinner" /> Đang xử lý...</>) : `Xác Nhận Đặt Hàng • ${formatPrice(finalPrice)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;