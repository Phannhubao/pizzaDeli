import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { GetUserByID } from "../../services/ApiService";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  // Lấy thông tin user khi vào trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetUserByID(userId);
        setUser(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
        Swal.fire("Lỗi", "Không thể tải thông tin người dùng", "error");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Hàm submit khi update user
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/users/${userId}`, user);
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
      <Card className="p-4 shadow">
        <h3 className="mb-3">Thông tin cá nhân</h3>
        {!editMode ? (
          <>
            <p><strong>Họ tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ngày sinh:</strong> {user.birthDate}</p>
            <p><strong>Địa chỉ:</strong> {user.address}</p>
            <p><strong>Trạng thái:</strong> {user.status}</p>
            <p><strong>Vai trò:</strong> {user.role}</p>
            <Button variant="primary" onClick={() => setEditMode(true)}>Chỉnh sửa</Button>
          </>
        ) : (
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control 
                type="text" 
                value={user.name} 
                onChange={(e) => setUser({ ...user, name: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control 
                type="date" 
                value={user.birthDate} 
                onChange={(e) => setUser({ ...user, birthDate: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control 
                type="text" 
                value={user.address} 
                onChange={(e) => setUser({ ...user, address: e.target.value })} 
              />
            </Form.Group>

            <Button variant="success" type="submit" className="me-2">Lưu</Button>
            <Button variant="secondary" onClick={() => setEditMode(false)}>Hủy</Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default ProfilePage;
