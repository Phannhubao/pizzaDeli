import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaSpinner } from "react-icons/fa";
import axios from "axios";
import CryptoJS from "crypto-js";
import '../../css/checkout.css'

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
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    createdAt: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const Domain = process.env.REACT_APP_API_URL || "https://deli-api.onrender.com";

  // Thông tin VNPay - returnUrl động trả về component VNPayReturn
  const vnpayConfig = {
    tmnCode: "2EYSS84X", 
    secretKey: "AT2JO218AOV4EHRYFUC7GW9FF755NBEL", 
    vnpayUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: `${getBaseUrl()}/vnpay-return`
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.fullName) {
      setCustomerInfo(prev => ({
        ...prev,
        fullName: currentUser.fullName,
        email: currentUser.email || ""
      }));
    }
    const savedCart = localStorage.getItem("pizza4ps_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          const cartWithQuantity = parsedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1
          }));
          setCartItems(cartWithQuantity);
        } else {
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error parsing cart:", error);
        navigate("/cart");
      }
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const formatPrice = price =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price)
      .replace("₫", " đ");

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!customerInfo.fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return false;
    }
    if (!customerInfo.phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!customerInfo.address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
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
      // 1. Tạo đơn hàng
      const orderData = {
        phone_number: customerInfo.phone,
        address: customerInfo.address,
        username: currentUser.username || customerInfo.fullName,
        quantity: totalQuantity,
        totalPrice: totalPrice,
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

      // 3. Tạo OrderDetail
      const orderDetailList = cartItems.map(item => ({
        quantity: item.quantity || 1,
        price: item.price || 0,
        produc_name: item.productName || "Unknown Product",
        image: item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png",
        orderId: orderId,
        productId: item.productId,
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
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        // Thanh toán COD: tạo đơn hàng ngay
        await createOrderForCOD();
        
        // Xóa giỏ hàng và hiển thị thông báo thành công
        localStorage.removeItem("pizza4ps_cart");
        setCartItems([]);
        setOrderSuccess(true);
        
      } else if (paymentMethod === "BANK_TRANSFER") {
        // Thanh toán VNPay: KHÔNG tạo đơn hàng ở đây, chỉ chuyển hướng đến VNPay
        // Tạo transaction ID duy nhất
        const transactionId = `VNPAY_${Date.now()}`;
        
        const vnpParams = {
          vnp_Version: '2.1.0',
          vnp_Command: 'pay',
          vnp_TmnCode: vnpayConfig.tmnCode,
          vnp_Amount: totalPrice * 100,
          vnp_CurrCode: 'VND',
          vnp_TxnRef: transactionId, // Dùng transaction ID duy nhất
          vnp_OrderInfo: `Thanh toan don hang ${transactionId}`,
          vnp_OrderType: 'billpayment',
          vnp_Locale: 'vn',
          vnp_ReturnUrl: vnpayConfig.returnUrl,
          vnp_IpAddr: '127.0.0.1',
          vnp_CreateDate: formatDateVN(new Date()),
          vnp_ExpireDate: formatDateVN(new Date(Date.now() + 15 * 60 * 1000)) // 15 phút
        };

        // Tạo secure hash
        const secureHash = createVnpayChecksum(vnpParams, vnpayConfig.secretKey);
        
        const vnpUrl = new URL(vnpayConfig.vnpayUrl);
        Object.keys(vnpParams).forEach(key => {
          vnpUrl.searchParams.append(key, vnpParams[key]);
        });
        vnpUrl.searchParams.append('vnp_SecureHash', secureHash);

        console.log("Redirecting to VNPay:", vnpUrl.toString());
        
        // Lưu thông tin đơn hàng tạm thời để sử dụng khi trả về
        const pendingOrder = {
          customerInfo,
          cartItems,
          totalPrice,
          totalItems,
          paymentMethod,
          transactionId: transactionId,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("pending_vnpay_order", JSON.stringify(pendingOrder));
        
        // 🚀 Chuyển hướng sang cổng thanh toán VNPay
        window.location.href = vnpUrl.toString();
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert(`Có lỗi xảy ra khi đặt hàng: ${err.response?.data?.message || err.message}. Vui lòng thử lại!`);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Đặt Hàng Thành Công!</h2>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất!</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </button>
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
          <h1 className="checkout-title"><FaShoppingCart /> Thanh Toán</h1>
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
                onChange={handleInputChange} placeholder="Ghi chú thêm (không bắt buộc)"
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
                <span>Thanh toán qua VNPay</span>
              </label>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="checkout-section">
            <h3 className="section-title">Tóm Tắt Đơn Hàng</h3>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="order-item">
                  <div className="item-info">
                    <img src={item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png"}
                      alt={item.productName} className="item-thumb" />
                    <div>
                      <h4>{item.productName}</h4>
                      <span className="item-quantity">x{item.quantity || 1}</span>
                    </div>
                  </div>
                  <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row"><span>Số lượng:</span><span>{totalItems}</span></div>
              <div className="summary-row"><span>Tạm tính:</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="summary-row"><span>Phí vận chuyển:</span><span>Miễn phí</span></div>
              <div className="summary-total"><span>Tổng cộng:</span><span>{formatPrice(totalPrice)}</span></div>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
              {loading ? (<><FaSpinner className="spinner" /> Đang xử lý...</>) : "Xác Nhận Đặt Hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;