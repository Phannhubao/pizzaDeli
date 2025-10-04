import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm tạo đơn hàng và chuyển đến trang thanh toán
  const handleCreateOrder = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await PostOrder(data);
      console.log("Order created successfully:", response);
      // Chuyển hướng đến trang thanh toán (e.g., /checkout)
      navigate("/checkout", { state: { orderId: response.orderId } }); // Truyền orderId nếu cần
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error,
      });
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ: Gọi hàm khi nhấn nút
  const handleSubmit = () => {
    const orderData = {
      // Dữ liệu đơn hàng (e.g., cart items, user info, etc.)
      userId: 1,
      items: [
        { productId: 1, quantity: 2, price: 100000 },
        { productId: 2, quantity: 1, price: 50000 },
      ],
      totalAmount: 250000,
      // Thêm các trường khác nếu cần
    };
    handleCreateOrder(orderData);
  };

  return (
    <div className="container">
      <h1>Tạo Đơn Hàng</h1>
      {loading && <div className="spinner-border text-primary" role="status" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        Tạo Đơn Hàng và Thanh Toán
      </button>
    </div>
  );
};

// Hàm PostOrder (định nghĩa ngoài component nếu cần tái sử dụng)
async function PostOrder(data) {
  return (await axios.post(`${Domain}/api/Order/AddOrder`, data)).data;
}

export default PaymentPage;