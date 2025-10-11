import React, { useState, useEffect } from "react";
import { 
  Form, 
  Button, 
  Container, 
  Card, 
  Spinner, 
  Table, 
  Row, 
  Col, 
  Pagination,
  Modal,
  Badge
} from "react-bootstrap";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import { GetUserByID, PutUser, GetOrdersByUserID } from "../../services/ApiService";
import { GetDetailListByOrder } from "../../services/ApiService";
import "../../css/profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // State cho modal và chi tiết đơn hàng
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]); // Đảm bảo luôn là array
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;


//   const registerVietnameseFont = (doc) => {
//   // Sử dụng font mặc định của jsPDF hỗ trợ Unicode
//   // doc.setFont("helvetica", "normal");
//   doc.setFont("times", "normal");
// };
  // Lấy thông tin user + đơn hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await GetUserByID(userId);
        setUser(userRes.data);

        const ordersRes = await GetOrdersByUserID(userId);
        setOrders(ordersRes);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        Swal.fire("Lỗi", "Không thể tải thông tin người dùng hoặc đơn hàng", "error");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  // Hàm mở modal chi tiết đơn hàng
  const handleShowOrderDetail = async (order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    setShowOrderDetail(true);
    
    try {
      const detailRes = await GetDetailListByOrder(order.orderId);
      console.log("API Response:", detailRes); // Debug log
      
      // Xử lý response để đảm bảo orderDetails luôn là array
      if (detailRes && detailRes.data) {
        // Nếu API trả về object có property data là array
        setOrderDetails(Array.isArray(detailRes.data) ? detailRes.data : []);
      } else if (Array.isArray(detailRes)) {
        // Nếu API trả về array trực tiếp
        setOrderDetails(detailRes);
      } else {
        // Fallback: set empty array
        setOrderDetails([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", err);
      Swal.fire("Lỗi", "Không thể tải chi tiết đơn hàng", "error");
      setOrderDetails([]); // Đảm bảo luôn là array
    } finally {
      setDetailLoading(false);
    }
  };

  // Hàm đóng modal
  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  // Cập nhật thông tin user
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await PutUser(userId, user);
      if (res.status === 200) {
        Swal.fire("Thành công", "Cập nhật thông tin thành công", "success");
        setEditMode(false);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      Swal.fire("Lỗi", "Không thể cập nhật thông tin", "error");
    }
  };

  // Hàm xuất PDF
  // const handleExportPDF = async () => {
  //   if (!selectedOrder || !Array.isArray(orderDetails)) {
  //     Swal.fire("Lỗi", "Không có dữ liệu để xuất PDF", "error");
  //     return;
  //   }

  //   setExporting(true);
    
  //   try {
  //     // Tạo PDF mới với orientation landscape để có nhiều không gian hơn
  //     const doc = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'mm',
  //       format: 'a4'
  //     });

  //     // Đăng ký font tiếng Việt
  //     registerVietnameseFont(doc);
      
  //     // Thiết lập font mặc định
  //     doc.setFont("times");
  //     doc.setFontSize(20);
  //     doc.setTextColor(40, 40, 40);
      
  //     // Tiêu đề công ty - sử dụng text thaydeli vì text để tránh lỗi font
  //     doc.text("PIZZA DELI RESTAURANT", 105, 20, { align: 'center' });
      
  //     doc.setFontSize(10);
  //     doc.setTextColor(100, 100, 100);
  //     doc.text("Dia chi: 123 Duong ABC, Quan 1, TP.HCM", 105, 27, { align: 'center' });
  //     doc.text("Dien thoai: 1900 1234 - Email: info@pizza.com", 105, 33, { align: 'center' });
      
  //     // Đường kẻ ngang
  //     doc.setDrawColor(200, 200, 200);
  //     doc.line(20, 40, 190, 40);
      
  //     // Tiêu đề hóa đơn
  //     doc.setFontSize(16);
  //     doc.setTextColor(102, 126, 234);
  //     doc.text(`HOA DON #${selectedOrder.orderId}`, 105, 50, { align: 'center' });
      
  //     // Thông tin khách hàng và đơn hàng
  //     doc.setFontSize(9);
  //     doc.setTextColor(80, 80, 80);
      
  //     // Thông tin khách hàng
  //     doc.text("THONG TIN KHACH HANG:", 25, 60);
  //     doc.text(`Ho ten: ${user?.name || 'N/A'}`, 25, 67);
  //     doc.text(`Email: ${user?.email || 'N/A'}`, 25, 74);
  //     doc.text(`Dien thoai: ${selectedOrder.phone_number || 'N/A'}`, 25, 81);
  //     doc.text(`Dia chi: ${selectedOrder.address || 'N/A'}`, 25, 88);
      
  //     // Thông tin đơn hàng
  //     doc.text("THONG TIN DON HANG:", 120, 60);
  //     doc.text(`Ma don: #${selectedOrder.orderId}`, 120, 67);
  //     doc.text(`Ngay dat: ${new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}`, 120, 74);
  //     doc.text(`Trang thai: ${selectedOrder.status}`, 120, 81);
  //     doc.text(`Phuong thuc: ${selectedOrder.paymentMethod || 'Thanh toan khi nhan hang'}`, 120, 88);
      
  //     // Bảng sản phẩm
  //     const tableColumn = ["STT", "Ten san pham", "So luong", "Don gia", "Thanh tien"];
  //     const tableRows = [];
      
  //     orderDetails.forEach((item, index) => {
  //       const productData = [
  //         index + 1,
  //         item.produc_name || "Khong co ten",
  //         item.quantity || 0,
  //         `${(item.price || 0).toLocaleString()} VND`,
  //         `${((item.price || 0) * (item.quantity || 0)).toLocaleString()} VND`
  //       ];
  //       tableRows.push(productData);
  //     });
      
  //     // Thêm bảng vào PDF
  //     autoTable(doc, {
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 95,
  //       styles: {
  //         fontSize: 8,
  //         cellPadding: 2,
  //         font: 'helvetica',
  //         fontStyle: 'normal'
  //       },
  //       headStyles: {
  //         fillColor: [102, 126, 234],
  //         textColor: 255,
  //         fontStyle: 'bold',
  //         font: 'helvetica'
  //       },
  //       bodyStyles: {
  //         font: 'helvetica',
  //         fontStyle: 'normal'
  //       },
  //       alternateRowStyles: {
  //         fillColor: [245, 245, 245]
  //       },
  //       margin: { top: 95 },
  //       didDrawPage: function (data) {
  //         // Đảm bảo font được giữ nguyên khi vẽ trang
  //         doc.setFont('helvetica', 'normal');
  //       }
  //     });
      
  //     // Tổng tiền
  //     const finalY = doc.lastAutoTable.finalY + 10;
  //     const totalAmount = calculateTotalFromDetails(orderDetails);
      
  //     doc.setFontSize(10);
  //     doc.setTextColor(40, 40, 40);
  //     doc.text("TONG TIEN:", 140, finalY);
  //     doc.setFontSize(12);
  //     doc.setTextColor(102, 126, 234);
  //     doc.text(`${totalAmount.toLocaleString()} VND`, 170, finalY, { align: 'right' });
      
  //     // Thuế và ghi chú
  //     doc.setFontSize(8);
  //     doc.setTextColor(100, 100, 100);
  //     doc.text("(Da bao gom VAT)", 170, finalY + 5, { align: 'right' });
      
  //     // Lời cảm ơn
  //     doc.setFontSize(9);
  //     doc.setTextColor(80, 80, 80);
  //     doc.text("Cam on quy khach da su dung dich vu!", 105, finalY + 20, { align: 'center' });
  //     doc.text("Hen gap lai quy khach trong nhung lan mua hang tiep theo!", 105, finalY + 27, { align: 'center' });
      
  //     // Chữ ký
  //     doc.text("Chu ky nguoi giao hang", 50, finalY + 45);
  //     doc.text("Chu ky khach hang", 150, finalY + 45);
      
  //     doc.line(40, finalY + 50, 90, finalY + 50);
  //     doc.line(140, finalY + 50, 190, finalY + 50);
      
  //     // Lưu file PDF
  //     doc.save(`hoa-don-${selectedOrder.orderId}.pdf`);
      
  //     Swal.fire({
  //       title: "Thành công!",
  //       text: "Hóa đơn đã được xuất thành công",
  //       icon: "success",
  //       timer: 2000,
  //       showConfirmButton: false
  //     });
      
  //   } catch (error) {
  //     console.error("Lỗi khi xuất PDF:", error);
  //     Swal.fire("Lỗi", "Không thể xuất file PDF", "error");
  //   } finally {
  //     setExporting(false);
  //   }
  // };
const handleExportPDF = async () => {
    if (!selectedOrder || !Array.isArray(orderDetails) || orderDetails.length === 0) {
      Swal.fire("Lỗi", "Không có dữ liệu để xuất PDF", "error");
      return;
    }

    setExporting(true);
    
    try {
      const totalAmount = calculateTotalFromDetails(orderDetails);
      
      // Tạo nội dung HTML cho hóa đơn
      const invoiceHTML = `
        <div style="font-family: 'DejaVu Sans', 'Arial Unicode MS', 'Arial', sans-serif; padding: 25px; max-width: 800px; margin: 0 auto; color: #333;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px; font-size: 28px;">PIZZA DELI RESTAURANT</h1>
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 14px;">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 14px;">Điện thoại: 1900 1234 - Email: info@pizzadeli.com</p>
          </div>
          
          <!-- Invoice Title -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #667eea; font-size: 24px; margin-bottom: 10px;">HÓA ĐƠN BÁN HÀNG</h2>
            <h3 style="color: #2c3e50; font-size: 20px; margin: 0;">#${selectedOrder.orderId}</h3>
          </div>
          
          <!-- Customer and Order Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; margin-bottom: 15px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 16px;">THÔNG TIN KHÁCH HÀNG</h4>
                <p style="margin: 8px 0;"><strong>Họ tên:</strong> ${user?.name || 'Chưa có thông tin'}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${user?.email || 'Chưa có thông tin'}</p>
                <p style="margin: 8px 0;"><strong>Điện thoại:</strong> ${selectedOrder.phone_number || 'Chưa có thông tin'}</p>
                <p style="margin: 8px 0;"><strong>Địa chỉ:</strong> ${selectedOrder.address || 'Chưa có thông tin'}</p>
              </div>
            </div>
            
            <div style="flex: 1; min-width: 300px; margin-bottom: 15px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 16px;">THÔNG TIN ĐƠN HÀNG</h4>
                <p style="margin: 8px 0;"><strong>Mã đơn:</strong> #${selectedOrder.orderId}</p>
                <p style="margin: 8px 0;"><strong>Ngày đặt:</strong> ${new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                <p style="margin: 8px 0;"><strong>Trạng thái:</strong> 
                  <span style="background: ${getStatusColor(selectedOrder.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">
                    ${selectedOrder.status}
                  </span>
                </p>
                <p style="margin: 8px 0;"><strong>Phương thức:</strong> ${selectedOrder.paymentMethod || 'Thanh toán khi nhận hàng'}</p>
              </div>
            </div>
          </div>
          
          <!-- Products Table -->
          <div style="margin-bottom: 30px;">
            <h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
              DANH SÁCH SẢN PHẨM
            </h4>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                  <th style="padding: 12px; text-align: left; font-weight: 600;">STT</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600;">Tên sản phẩm</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600;">Số lượng</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600;">Đơn giá</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.map((item, index) => `
                  <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'} border-bottom: 1px solid #e9ecef;">
                    <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${index + 1}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">
                      <div>
                        <strong>${item.produc_name || 'Không có tên'}</strong>
                        <br>
                        <small style="color: #6c757d;">Mã SP: ${item.productId || 'N/A'}</small>
                      </div>
                    </td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e9ecef;">
                      <span style="background: #6c757d; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">
                        ${item.quantity || 0}
                      </span>
                    </td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e9ecef;">
                      ${(item.price || 0).toLocaleString('vi-VN')} ₫
                    </td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e9ecef; font-weight: 600;">
                      ${((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background: #e9ecef;">
                  <td colspan="4" style="padding: 15px; text-align: right; font-weight: 700; font-size: 16px;">
                    TỔNG CỘNG:
                  </td>
                  <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px; color: #667eea;">
                    ${totalAmount.toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
                <tr style="background: #e9ecef;">
                  <td colspan="5" style="padding: 5px 15px; text-align: right; font-size: 12px; color: #6c757d;">
                    (Đã bao gồm VAT)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <!-- Thank You Message -->
          <div style="text-align: center; margin: 40px 0 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
            <h4 style="margin-bottom: 10px; font-size: 18px;">Cảm ơn quý khách đã sử dụng dịch vụ!</h4>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Hẹn gặp lại quý khách trong những lần mua hàng tiếp theo!</p>
          </div>
          
          <!-- Signatures -->
          <div style="display: flex; justify-content: space-between; margin-top: 50px;">
            <div style="text-align: center; flex: 1;">
              <p style="margin-bottom: 40px; font-weight: 600;">Chữ ký người giao hàng</p>
              <div style="border-top: 2px solid #333; width: 200px; margin: 0 auto;"></div>
            </div>
            <div style="text-align: center; flex: 1;">
              <p style="margin-bottom: 40px; font-weight: 600;">Chữ ký khách hàng</p>
              <div style="border-top: 2px solid #333; width: 200px; margin: 0 auto;"></div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 5px 0;">
              Hóa đơn điện tử - Có giá trị như hóa đơn GTGT
            </p>
            <p style="color: #6c757d; font-size: 12px; margin: 5px 0;">
              Ngày xuất: ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `;

      // Tạo element từ HTML
      const element = document.createElement('div');
      element.innerHTML = invoiceHTML;

      // Cấu hình PDF
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `hoa-don-${selectedOrder.orderId}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Xuất PDF
      await html2pdf().set(opt).from(element).save();
      
      Swal.fire({
        title: "Thành công!",
        text: "Hóa đơn đã được xuất thành công",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      Swal.fire("Lỗi", "Không thể xuất file PDF. Vui lòng thử lại.", "error");
    } finally {
      setExporting(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return '#28a745';
      case 'processing':
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      case 'shipped':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };
  // Phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tạo mảng page numbers cho pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Tính tổng tiền từ chi tiết đơn hàng
  const calculateTotalFromDetails = (details) => {
    if (!Array.isArray(details)) return 0;
    return details.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Safe function để render order details
  const renderOrderDetails = () => {
    // Đảm bảo orderDetails là array trước khi map
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return (
        <div className="text-center py-3 text-muted">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>Không có chi tiết đơn hàng</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-light">
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th className="text-center">Số lượng</th>
              <th className="text-end">Đơn giá</th>
              <th className="text-end">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item) => (
              <tr key={item.detailId || item.productId}>
                <td>
                  <img
                    src={item.image || "/default-image.png"}
                    alt={item.produc_name || "Sản phẩm"}
                    className="product-image-modal"
                    onError={(e) => {
                      e.target.src = "/default-image.png";
                    }}
                  />
                </td>
                <td>
                  <div>
                    <strong>{item.produc_name || "Không có tên"}</strong>
                    <br />
                    <small className="text-muted">Mã SP: {item.productId || "N/A"}</small>
                  </div>
                </td>
                <td className="text-center">
                  <Badge bg="secondary">{item.quantity || 0}</Badge>
                </td>
                <td className="text-end">
                  {(item.price || 0)?.toLocaleString()} ₫
                </td>
                <td className="text-end fw-bold">
                  {((item.price || 0) * (item.quantity || 0))?.toLocaleString()} ₫
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-light">
            <tr>
              <td colSpan="4" className="text-end"><strong>Tổng cộng:</strong></td>
              <td className="text-end fw-bold text-primary fs-5">
                {calculateTotalFromDetails(orderDetails)?.toLocaleString()} ₫
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải thông tin...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h4>Không tìm thấy người dùng</h4>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-4 profile-container">
        <Row>
          <Col lg={4} className="mb-4">
            {/* Thông tin cá nhân - Giữ nguyên */}
            <Card className="profile-card shadow-sm">
              <Card.Body className="p-4">
                <div className="profile-header text-center mb-4">
                  <div className="profile-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <h4 className="profile-name mt-3">{user.name}</h4>
                  <span className="profile-badge">{user.role}</span>
                </div>

                {!editMode ? (
                  <div className="profile-info">
                    <div className="info-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <label>Email</label>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-birthday-cake"></i>
                      <div>
                        <label>Ngày sinh</label>
                        <p>{user.birthDate || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <label>Địa chỉ</label>
                        <p>{user.address || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-user-check"></i>
                      <div>
                        <label>Trạng thái</label>
                        <p className={`status ${user.status?.toLowerCase()}`}>
                          {user.status}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="edit-btn w-100 mt-3"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleSave} className="edit-form">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2"></i>
                        Họ tên
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-birthday-cake me-2"></i>
                        Ngày sinh
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={user.birthDate || ""}
                        onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Địa chỉ
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={user.address || ""}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                        className="form-control-custom"
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button variant="success" type="submit" className="save-btn">
                        <i className="fas fa-check me-2"></i>
                        Lưu thay đổi
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setEditMode(false)}
                      >
                        <i className="fas fa-times me-2"></i>
                        Hủy
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {/* Danh sách đơn hàng - Giữ nguyên */}
            <Card className="orders-card shadow-sm">
              <Card.Body className="p-4">
                <div className="orders-header d-flex justify-content-between align-items-center mb-4">
                  <h3 className="orders-title">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Đơn hàng của bạn
                  </h3>
                  <span className="orders-count badge bg-primary">
                    {orders.length} đơn hàng
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-5 empty-orders">
                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Chưa có đơn hàng nào</h5>
                    <p className="text-muted">Hãy bắt đầu mua sắm ngay!</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="orders-table">
                        <thead className="table-header">
                          <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                            <th>Chi tiết</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.map((order) => (
                            <tr 
                              key={order.orderId} 
                              className="order-row"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleShowOrderDetail(order)}
                            >
                              <td className="order-id">#{order.orderId}</td>
                              <td className="order-date">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="order-address">
                                <small>{order.address}</small>
                              </td>
                              <td>
                                <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="order-quantity">
                                {order.quantity}
                              </td>
                              <td className="order-total fw-bold text-primary">
                                {order.totalPrice?.toLocaleString()} ₫
                              </td>
                              <td className="text-center">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowOrderDetail(order);
                                  }}
                                >
                                  <i className="fas fa-eye"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                      <div className="pagination-container mt-4">
                        <Pagination className="justify-content-center">
                          <Pagination.Prev 
                            disabled={currentPage === 1}
                            onClick={() => paginate(currentPage - 1)}
                          />
                          
                          {pageNumbers.map(number => (
                            <Pagination.Item
                              key={number}
                              active={number === currentPage}
                              onClick={() => paginate(number)}
                            >
                              {number}
                            </Pagination.Item>
                          ))}
                          
                          <Pagination.Next 
                            disabled={currentPage === totalPages}
                            onClick={() => paginate(currentPage + 1)}
                          />
                        </Pagination>
                        
                        <div className="text-center text-muted mt-2">
                          Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} của {orders.length} đơn hàng
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal chi tiết đơn hàng - ĐÃ SỬA */}
      <Modal 
        show={showOrderDetail} 
        onHide={handleCloseOrderDetail}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <i className="fas fa-receipt me-2"></i>
            Chi tiết đơn hàng #{selectedOrder?.orderId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : (
            <>
              {/* Thông tin chung đơn hàng */}
              {selectedOrder && (
                <Card className="mb-4 order-summary-card">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Số điện thoại:</strong> {selectedOrder.phone_number}</p>
                        <p>
                          <strong>Trạng thái:</strong> 
                          <Badge bg={getStatusBadgeVariant(selectedOrder.status)} className="ms-2">
                            {selectedOrder.status}
                          </Badge>
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Danh sách sản phẩm - Sử dụng hàm safe render */}
              <h6 className="mb-3">Danh sách sản phẩm</h6>
              {renderOrderDetails()}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrderDetail}>
            Đóng
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExportPDF}
            disabled={exporting || !selectedOrder || orderDetails.length === 0}
          >
            {exporting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xuất...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf me-2"></i>
                Xuất PDF
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Hàm xác định màu badge cho trạng thái
const getStatusBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'success';
    case 'processing':
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    case 'shipped':
      return 'info';
    default:
      return 'secondary';
  }
};

export default ProfilePage;