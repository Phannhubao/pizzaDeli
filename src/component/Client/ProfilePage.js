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
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

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
          <Button variant="primary">
            <i className="fas fa-print me-2"></i>
            In hóa đơn
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