



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaSpinner } from "react-icons/fa";
// import axios from "axios";
// import '../../css/checkout.css'

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   const [customerInfo, setCustomerInfo] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     address: "",
//     note: "",
//     createdAt: "" // Thêm trường createdAt
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const Domain = process.env.REACT_APP_API_URL || "http://localhost:8080";

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//     if (currentUser.fullName) {
//       setCustomerInfo(prev => ({
//         ...prev,
//         fullName: currentUser.fullName,
//         email: currentUser.email || ""
//       }));
//     }
//     const savedCart = localStorage.getItem("pizza4ps_cart");
//     if (savedCart) {
//       try {
//         const parsedCart = JSON.parse(savedCart);
//         if (Array.isArray(parsedCart) && parsedCart.length > 0) {
//           const cartWithQuantity = parsedCart.map(item => ({
//             ...item,
//             quantity: item.quantity || 1
//           }));
//           setCartItems(cartWithQuantity);
//         } else {
//           navigate("/cart");
//         }
//       } catch (error) {
//         console.error("Error parsing cart:", error);
//         navigate("/cart");
//       }
//     } else {
//       navigate("/cart");
//     }
//   }, [navigate]);

//   const formatPrice = price =>
//     new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
//       .format(price)
//       .replace("₫", " đ");

//   const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
//   const totalPrice = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setCustomerInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     if (!customerInfo.fullName.trim()) {
//       alert("Vui lòng nhập họ tên");
//       return false;
//     }
//     if (!customerInfo.phone.trim()) {
//       alert("Vui lòng nhập số điện thoại");
//       return false;
//     }
//     if (!customerInfo.address.trim()) {
//       alert("Vui lòng nhập địa chỉ giao hàng");
//       return false;
//     }
//     return true;
//   };

//   const handleCheckout = async () => {
//     if (!validateForm()) return;
//     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = currentUser.id || currentUser.userId;
//     setLoading(true);

//     try {
//       const currentTime = new Date().toISOString(); // Lấy thời điểm hiện tại
//       const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

//       // 1. Tạo đơn hàng
//       const orderData = {
//         phone_number: customerInfo.phone,
//         address: customerInfo.address,
//         username: currentUser.username || customerInfo.fullName,
//         quantity: totalQuantity,
//         totalPrice: totalPrice,
//         image: cartItems[0]?.image || "img/default-product.png",
//         userId: userId,
//         createdAt: currentTime // Thêm createdAt vào orderData
//       };

//       const orderRes = await axios.post(`${Domain}/api/Order/AddOrder`, orderData, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 2. Lấy orderId và ép kiểu về Number
//       let orderId = null;
//       if (orderRes.data?.orderId) {
//         orderId = orderRes.data.orderId;
//       } else if (orderRes.data?.id) {
//         orderId = orderRes.data.id;
//       } else if (orderRes.data?.OrderId) {
//         orderId = orderRes.data.OrderId;
//       } else if (orderRes.data?.data?.orderId) {
//         orderId = orderRes.data.data.orderId;
//       } else if (typeof orderRes.data === "number") {
//         orderId = orderRes.data;
//       }
//       if (!orderId || isNaN(orderId)) {
//         throw new Error("Không nhận được ID đơn hàng hợp lệ từ server");
//       }
//       orderId = Number(orderId);

//       // 3. Chuẩn bị danh sách OrderDetail
//       const orderDetailList = cartItems.map(item => ({
//         quantity: item.quantity || 1,
//         price: item.price || 0,
//         produc_name: item.productName || "Unknown Product",
//         image: item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png",
//         orderId: orderId,
//         productId: item.productId,
//         canFeedBack: false
//       }));

//       // 4. Gửi tất cả OrderDetail
//       await axios.post(`${Domain}/api/OrderDeTail/AddOrderDetailList`, orderDetailList, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 5. Gửi thông tin thanh toán
//       const paymentData = {
//         orderId: orderId,
//         fullname: customerInfo.fullName,
//         status: paymentMethod !== "COD"
//       };
//       await axios.post(`${Domain}/api/Payment/AddPayment`, paymentData, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 6. Xóa giỏ hàng và cập nhật trạng thái
//       localStorage.removeItem("pizza4ps_cart");
//       setCartItems([]);
//       setOrderSuccess(true);
//     } catch (err) {
//       console.error("Checkout error:", err.response?.data || err.message);
//       alert(`Có lỗi xảy ra khi đặt hàng: ${err.response?.data?.message || err.message}. Vui lòng thử lại!`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (orderSuccess) {
//     return (
//       <div className="checkout-page">
//         <div className="checkout-container">
//           <div className="success-message">
//             <div className="success-icon">✅</div>
//             <h2>Đặt Hàng Thành Công!</h2>
//             <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất!</p>
//             <button className="continue-shopping-btn" onClick={() => navigate("/")}>
//               Tiếp tục mua sắm
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <div className="checkout-header">
//           <button className="back-button" onClick={() => navigate("/cart")}>
//             <FaArrowLeft /> Quay lại giỏ hàng
//           </button>
//           <h1 className="checkout-title"><FaShoppingCart /> Thanh Toán</h1>
//         </div>

//         <div className="checkout-content">
//           {/* Thông tin khách hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaUser /> Thông Tin Khách Hàng</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Họ và tên *</label>
//                 <input type="text" name="fullName" value={customerInfo.fullName}
//                   onChange={handleInputChange} placeholder="Nhập họ và tên" required />
//               </div>
//               <div className="form-group">
//                 <label>Số điện thoại *</label>
//                 <input type="tel" name="phone" value={customerInfo.phone}
//                   onChange={handleInputChange} placeholder="Nhập số điện thoại" required />
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input type="email" name="email" value={customerInfo.email}
//                   onChange={handleInputChange} placeholder="Nhập email (không bắt buộc)" />
//               </div>
//             </div>
//           </div>

//           {/* Địa chỉ giao hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaMapMarkerAlt /> Địa Chỉ Giao Hàng</h3>
//             <div className="form-group">
//               <label>Địa chỉ *</label>
//               <textarea name="address" value={customerInfo.address}
//                 onChange={handleInputChange} placeholder="Nhập địa chỉ giao hàng chi tiết"
//                 rows="3" required />
//             </div>
//             <div className="form-group">
//               <label>Ghi chú</label>
//               <textarea name="note" value={customerInfo.note}
//                 onChange={handleInputChange} placeholder="Ghi chú thêm (không bắt buộc)"
//                 rows="2" />
//             </div>
//           </div>

//           {/* Phương thức thanh toán */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaCreditCard /> Phương Thức Thanh Toán</h3>
//             <div className="payment-methods">
//               <label className="payment-option">
//                 <input type="radio" name="paymentMethod" value="COD"
//                   checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
//                 <span>Thanh toán khi nhận hàng (COD)</span>
//               </label>
//               <label className="payment-option">
//                 <input type="radio" name="paymentMethod" value="BANK_TRANSFER"
//                   checked={paymentMethod === "BANK_TRANSFER"} onChange={(e) => setPaymentMethod(e.target.value)} />
//                 <span>Chuyển khoản ngân hàng</span>
//               </label>
//             </div>
//           </div>

//           {/* Tóm tắt đơn hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title">Tóm Tắt Đơn Hàng</h3>
//             <div className="order-items">
//               {cartItems.map((item) => (
//                 <div key={item.productId} className="order-item">
//                   <div className="item-info">
//                     <img src={item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png"}
//                       alt={item.productName} className="item-thumb" />
//                     <div>
//                       <h4>{item.productName}</h4>
//                       <span className="item-quantity">x{item.quantity || 1}</span>
//                     </div>
//                   </div>
//                   <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="order-summary">
//               <div className="summary-row"><span>Số lượng:</span><span>{totalItems}</span></div>
//               <div className="summary-row"><span>Tạm tính:</span><span>{formatPrice(totalPrice)}</span></div>
//               <div className="summary-row"><span>Phí vận chuyển:</span><span>Miễn phí</span></div>
//               <div className="summary-total"><span>Tổng cộng:</span><span>{formatPrice(totalPrice)}</span></div>
//             </div>
//           </div>

//           <div className="checkout-actions">
//             <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
//               {loading ? (<><FaSpinner className="spinner" /> Đang xử lý...</>) : "Xác Nhận Đặt Hàng"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;










// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaSpinner, FaQrcode } from "react-icons/fa";
// import axios from "axios";
// import { QRCodeCanvas } from "qrcode.react"; // Updated import
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import '../../css/checkout.css'

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [showQRModal, setShowQRModal] = useState(false);
//   const [qrData, setQRData] = useState("");
//   const [qrTimer, setQRTimer] = useState(600); // 10 phút = 600 giây

//   const [customerInfo, setCustomerInfo] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     address: "",
//     note: "",
//     createdAt: ""
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const Domain = process.env.REACT_APP_API_URL || "http://localhost:8080";

//   // Thông tin ngân hàng (có thể tùy chỉnh hoặc lấy từ API)
//   const bankInfo = {
//     bankName: "Vietcombank",
//     accountNumber: "1234567890",
//     accountHolder: "Công ty Pizza 4P's",
//     branch: "Hà Nội"
//   };

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//     if (currentUser.fullName) {
//       setCustomerInfo(prev => ({
//         ...prev,
//         fullName: currentUser.fullName,
//         email: currentUser.email || ""
//       }));
//     }
//     const savedCart = localStorage.getItem("pizza4ps_cart");
//     if (savedCart) {
//       try {
//         const parsedCart = JSON.parse(savedCart);
//         if (Array.isArray(parsedCart) && parsedCart.length > 0) {
//           const cartWithQuantity = parsedCart.map(item => ({
//             ...item,
//             quantity: item.quantity || 1
//           }));
//           setCartItems(cartWithQuantity);
//         } else {
//           navigate("/cart");
//         }
//       } catch (error) {
//         console.error("Error parsing cart:", error);
//         navigate("/cart");
//       }
//     } else {
//       navigate("/cart");
//     }
//   }, [navigate]);

//   // Countdown timer cho mã QR
//   useEffect(() => {
//     let timer;
//     if (showQRModal && qrTimer > 0) {
//       timer = setInterval(() => {
//         setQRTimer(prev => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [showQRModal, qrTimer]);

//   const formatPrice = price =>
//     new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
//       .format(price)
//       .replace("₫", " đ");

//   const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
//   const totalPrice = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setCustomerInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     if (!customerInfo.fullName.trim()) {
//       alert("Vui lòng nhập họ tên");
//       return false;
//     }
//     if (!customerInfo.phone.trim()) {
//       alert("Vui lòng nhập số điện thoại");
//       return false;
//     }
//     if (!customerInfo.address.trim()) {
//       alert("Vui lòng nhập địa chỉ giao hàng");
//       return false;
//     }
//     return true;
//   };

//   const handleCheckout = async () => {
//     if (!validateForm()) return;
//     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = currentUser.id || currentUser.userId;
//     setLoading(true);

//     try {
//       const currentTime = new Date().toISOString();
//       const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

//       // 1. Tạo đơn hàng
//       const orderData = {
//         phone_number: customerInfo.phone,
//         address: customerInfo.address,
//         username: currentUser.username || customerInfo.fullName,
//         quantity: totalQuantity,
//         totalPrice: totalPrice,
//         image: cartItems[0]?.image || "img/default-product.png",
//         userId: userId,
//         createdAt: currentTime
//       };

//       const orderRes = await axios.post(`${Domain}/api/Order/AddOrder`, orderData, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 2. Lấy orderId
//       let orderId = null;
//       if (orderRes.data?.orderId) {
//         orderId = orderRes.data.orderId;
//       } else if (orderRes.data?.id) {
//         orderId = orderRes.data.id;
//       } else if (orderRes.data?.OrderId) {
//         orderId = orderRes.data.OrderId;
//       } else if (orderRes.data?.data?.orderId) {
//         orderId = orderRes.data.data.orderId;
//       } else if (typeof orderRes.data === "number") {
//         orderId = orderRes.data;
//       }
//       if (!orderId || isNaN(orderId)) {
//         throw new Error("Không nhận được ID đơn hàng hợp lệ từ server");
//       }
//       orderId = Number(orderId);

//       // 3. Tạo OrderDetail
//       const orderDetailList = cartItems.map(item => ({
//         quantity: item.quantity || 1,
//         price: item.price || 0,
//         produc_name: item.productName || "Unknown Product",
//         image: item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png",
//         orderId: orderId,
//         productId: item.productId,
//         canFeedBack: false
//       }));

//       await axios.post(`${Domain}/api/OrderDeTail/AddOrderDetailList`, orderDetailList, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 4. Gửi thông tin thanh toán
//       const paymentData = {
//         orderId: orderId,
//         fullname: customerInfo.fullName,
//         status: paymentMethod !== "COD"
//       };
//       await axios.post(`${Domain}/api/Payment/AddPayment`, paymentData, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // 5. Tạo mã QR nếu chọn BANK_TRANSFER
//       if (paymentMethod === "BANK_TRANSFER") {
//         const qrString = `bank://transfer?account=${bankInfo.accountNumber}&amount=${totalPrice}&memo=Order_${orderId}&bank=${bankInfo.bankName}`;
//         setQRData(qrString);
//         setQRTimer(600); // Reset timer 10 phút
//         setShowQRModal(true);
//       } else {
//         // Nếu COD, hiển thị thông báo thành công
//         localStorage.removeItem("pizza4ps_cart");
//         setCartItems([]);
//         setOrderSuccess(true);
//       }
//     } catch (err) {
//       console.error("Checkout error:", err.response?.data || err.message);
//       alert(`Có lỗi xảy ra khi đặt hàng: ${err.response?.data?.message || err.message}. Vui lòng thử lại!`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTimer = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   if (orderSuccess) {
//     return (
//       <div className="checkout-page">
//         <div className="checkout-container">
//           <div className="success-message">
//             <div className="success-icon">✅</div>
//             <h2>Đặt Hàng Thành Công!</h2>
//             <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất!</p>
//             <button className="continue-shopping-btn" onClick={() => navigate("/")}>
//               Tiếp tục mua sắm
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <div className="checkout-header">
//           <button className="back-button" onClick={() => navigate("/cart")}>
//             <FaArrowLeft /> Quay lại giỏ hàng
//           </button>
//           <h1 className="checkout-title"><FaShoppingCart /> Thanh Toán</h1>
//         </div>

//         <div className="checkout-content">
//           {/* Thông tin khách hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaUser /> Thông Tin Khách Hàng</h3>
//             <div className="form-grid">
//               <div className="form-group">
//                 <label>Họ và tên *</label>
//                 <input type="text" name="fullName" value={customerInfo.fullName}
//                   onChange={handleInputChange} placeholder="Nhập họ và tên" required />
//               </div>
//               <div className="form-group">
//                 <label>Số điện thoại *</label>
//                 <input type="tel" name="phone" value={customerInfo.phone}
//                   onChange={handleInputChange} placeholder="Nhập số điện thoại" required />
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input type="email" name="email" value={customerInfo.email}
//                   onChange={handleInputChange} placeholder="Nhập email (không bắt buộc)" />
//               </div>
//             </div>
//           </div>

//           {/* Địa chỉ giao hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaMapMarkerAlt /> Địa Chỉ Giao Hàng</h3>
//             <div className="form-group">
//               <label>Địa chỉ *</label>
//               <textarea name="address" value={customerInfo.address}
//                 onChange={handleInputChange} placeholder="Nhập địa chỉ giao hàng chi tiết"
//                 rows="3" required />
//             </div>
//             <div className="form-group">
//               <label>Ghi chú</label>
//               <textarea name="note" value={customerInfo.note}
//                 onChange={handleInputChange} placeholder="Ghi chú thêm (không bắt buộc)"
//                 rows="2" />
//             </div>
//           </div>

//           {/* Phương thức thanh toán */}
//           <div className="checkout-section">
//             <h3 className="section-title"><FaCreditCard /> Phương Thức Thanh Toán</h3>
//             <div className="payment-methods">
//               <label className="payment-option">
//                 <input type="radio" name="paymentMethod" value="COD"
//                   checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
//                 <span>Thanh toán khi nhận hàng (COD)</span>
//               </label>
//               <label className="payment-option">
//                 <input type="radio" name="paymentMethod" value="BANK_TRANSFER"
//                   checked={paymentMethod === "BANK_TRANSFER"} onChange={(e) => setPaymentMethod(e.target.value)} />
//                 <span>Chuyển khoản ngân hàng</span>
//               </label>
//             </div>
//           </div>

//           {/* Tóm tắt đơn hàng */}
//           <div className="checkout-section">
//             <h3 className="section-title">Tóm Tắt Đơn Hàng</h3>
//             <div className="order-items">
//               {cartItems.map((item) => (
//                 <div key={item.productId} className="order-item">
//                   <div className="item-info">
//                     <img src={item.image?.startsWith("../") ? item.image.substring(2) : item.image || "img/default-product.png"}
//                       alt={item.productName} className="item-thumb" />
//                     <div>
//                       <h4>{item.productName}</h4>
//                       <span className="item-quantity">x{item.quantity || 1}</span>
//                     </div>
//                   </div>
//                   <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="order-summary">
//               <div className="summary-row"><span>Số lượng:</span><span>{totalItems}</span></div>
//               <div className="summary-row"><span>Tạm tính:</span><span>{formatPrice(totalPrice)}</span></div>
//               <div className="summary-row"><span>Phí vận chuyển:</span><span>Miễn phí</span></div>
//               <div className="summary-total"><span>Tổng cộng:</span><span>{formatPrice(totalPrice)}</span></div>
//             </div>
//           </div>

//           <div className="checkout-actions">
//             <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
//               {loading ? (<><FaSpinner className="spinner" /> Đang xử lý...</>) : "Xác Nhận Đặt Hàng"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal hiển thị mã QR */}
//       <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title><FaQrcode /> Thanh Toán Chuyển Khoản</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="qr-code-container">
//             <h4>Quét mã QR để thanh toán</h4>
//             <p>Vui lòng hoàn tất chuyển khoản trong <strong>{formatTimer(qrTimer)}</strong> phút</p>
//             {qrTimer > 0 ? (
//               <>
//                 <QRCodeCanvas value={qrData} size={200} className="qr-code" /> {/* Updated to QRCodeCanvas */}
//                 <div className="bank-info">
//                   <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
//                   <p><strong>Số tài khoản:</strong> {bankInfo.accountNumber}</p>
//                   <p><strong>Chủ tài khoản:</strong> {bankInfo.accountHolder}</p>
//                   <p><strong>Số tiền:</strong> {formatPrice(totalPrice)}</p>
//                   {/* <p><strong>Nội dung:</strong> Order_{orderId}</p> */}
//                 </div>
//               </>
//             ) : (
//               <p className="qr-expired">Mã QR đã hết hạn. Vui lòng tạo lại đơn hàng.</p>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowQRModal(false)}>
//             Đóng
//           </Button>
//           {qrTimer > 0 && (
//             <Button variant="primary" onClick={() => {
//               setShowQRModal(false);
//               setOrderSuccess(true);
//               localStorage.removeItem("pizza4ps_cart");
//               setCartItems([]);
//             }}>
//               Tôi đã chuyển khoản
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default CheckoutPage;










import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaSpinner, FaQrcode } from "react-icons/fa";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CryptoJS from "crypto-js"; // Import crypto-js
import '../../css/checkout.css'

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQRData] = useState("");
  const [qrTimer, setQRTimer] = useState(600); // 10 phút = 600 giây
  const [orderId, setOrderId] = useState(null); // Thêm state để lưu orderId

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

  // Thông tin VNPay (có thể lưu trong .env)
  const vnpayConfig = {
    tmnCode: "2EYSS84X", // Thay bằng TMN Code của bạn
    secretKey: "AT2JO218AOV4EHRYFUC7GW9FF755NBEL", // Thay bằng Secret Key của bạn
    vnpayUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: "http://localhost:3000/vnpay_return"
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

  // Countdown timer cho mã QR
  useEffect(() => {
    let timer;
    if (showQRModal && qrTimer > 0) {
      timer = setInterval(() => {
        setQRTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQRModal, qrTimer]);

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
      result[key] = params[key];
      return result;
    }, {});
    const signData = new URLSearchParams(sortedParams).toString();
    return CryptoJS.HmacSHA512(signData, secretKey).toString();
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = currentUser.id || currentUser.userId;
    setLoading(true);

    try {
      const currentTime = new Date().toISOString();
      const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

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
      setOrderId(orderId); // Lưu orderId vào state

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

      // 4. Gửi thông tin thanh toán
      const paymentData = {
        orderId: orderId,
        fullname: customerInfo.fullName,
        status: paymentMethod !== "COD"
      };
      await axios.post(`${Domain}/api/Payment/AddPayment`, paymentData, {
        headers: { "Content-Type": "application/json" }
      });

      // 5. Tạo URL thanh toán VNPay nếu chọn BANK_TRANSFER
      if (paymentMethod === "BANK_TRANSFER") {
        const vnpParams = {
          vnp_Version: '2.1.0',
          vnp_Command: 'pay',
          vnp_TmnCode: vnpayConfig.tmnCode,
          vnp_Amount: totalPrice * 100, // VNPay yêu cầu số tiền nhân 100
          vnp_CurrCode: 'VND',
          vnp_TxnRef: `Order_${orderId}`,
          vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
          vnp_OrderType: 'billpayment',
          vnp_Locale: 'vn',
          vnp_ReturnUrl: vnpayConfig.returnUrl,
          vnp_IpAddr: '127.0.0.1', // Có thể lấy IP thực từ client
          vnp_CreateDate: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
          vnp_ExpireDate: new Date(Date.now() + 10 * 60 * 1000).toISOString().replace(/[-:T.]/g, '').slice(0, 14) // Hết hạn sau 10 phút
        };

        const vnpUrl = new URL(vnpayConfig.vnpayUrl);
        Object.keys(vnpParams).forEach(key => vnpUrl.searchParams.append(key, vnpParams[key]));
        vnpUrl.searchParams.append('vnp_SecureHash', createVnpayChecksum(vnpParams, vnpayConfig.secretKey));

        setQRData(vnpUrl.toString());
        setQRTimer(600); // Reset timer 10 phút
        setShowQRModal(true);
      } else {
        // Nếu COD, hiển thị thông báo thành công
        localStorage.removeItem("pizza4ps_cart");
        setCartItems([]);
        setOrderSuccess(true);
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert(`Có lỗi xảy ra khi đặt hàng: ${err.response?.data?.message || err.message}. Vui lòng thử lại!`);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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

      {/* Modal hiển thị mã QR VNPay */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaQrcode /> Thanh Toán Qua VNPay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="qr-code-container">
            <h4>Quét mã QR để thanh toán</h4>
            <p>Vui lòng hoàn tất thanh toán trong <strong>{formatTimer(qrTimer)}</strong> phút</p>
            {qrTimer > 0 ? (
              <>
                <QRCodeCanvas value={qrData} size={200} className="qr-code" />
                <div className="bank-info">
                  <p><strong>Số tiền:</strong> {formatPrice(totalPrice)}</p>
                  <p><strong>Nội dung:</strong> Order_{orderId}</p>
                  <p><a href={qrData} target="_blank" rel="noopener noreferrer">Mở cổng thanh toán VNPay</a></p>
                </div>
              </>
            ) : (
              <p className="qr-expired">Mã QR đã hết hạn. Vui lòng tạo lại đơn hàng.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Đóng
          </Button>
          {qrTimer > 0 && (
            <Button variant="primary" onClick={() => {
              window.open(qrData, '_blank');
            }}>
              Thanh Toán Ngay
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPage;








