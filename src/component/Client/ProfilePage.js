import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { GetUserByID, PutUser, GetOrdersByUserID } from "../../services/ApiService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

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

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
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
    <Container className="mt-5">
      {/* Thông tin cá nhân */}
      <Card className="p-4 shadow mb-4">
        <h3 className="mb-3">Thông tin cá nhân</h3>
        {!editMode ? (
          <>
            <p><strong>Họ tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ngày sinh:</strong> {user.birthDate}</p>
            <p><strong>Địa chỉ:</strong> {user.address}</p>
            <p><strong>Trạng thái:</strong> {user.status}</p>
            <p><strong>Vai trò:</strong> {user.role}</p>
            <Button variant="primary" onClick={() => setEditMode(true)}>
              Chỉnh sửa
            </Button>
          </>
        ) : (
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                value={user.birthDate || ""}
                onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="me-2">
              Lưu
            </Button>
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Hủy
            </Button>
          </Form>
        )}
      </Card>

      {/* Danh sách đơn hàng */}
      <Card className="p-4 shadow">
        <h3 className="mb-3">Đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Trạng thái</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Ảnh</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.address}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.status}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice.toLocaleString()} ₫</td>
                  <td>
                    <img
                      src={order.image}
                      alt="product"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default ProfilePage;
