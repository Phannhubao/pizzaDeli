import { useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Icon } from "@mui/material";
import { PostRegister } from "../../../../../services/ApiService";
import Swal from "sweetalert2";

const UserAddModal = ({ show, onHide, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    address: "",
    role: "CUSTOMER",
    password: "", // Thêm trường password
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Xử lý gửi dữ liệu
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.birthDate) newErrors.birthDate = "Ngày sinh không được để trống";
    if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống";
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const newData = {
        ...formData,
        status: "ACTIVE",
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : null,
      };
      console.log("Dữ liệu gửi đi:", newData); // Log dữ liệu gửi để debug
      const response = await PostRegister(newData);
      console.log("Phản hồi từ server:", response); // Log phản hồi
      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã thêm người dùng thành công",
          timer: 1500,
          showConfirmButton: false,
        });
        if (onUserAdded) onUserAdded();
        setFormData({
          name: "",
          email: "",
          birthDate: "",
          address: "",
          role: "CUSTOMER",
          password: "", // Reset password
        }); // Reset form sau khi thành công
      } else {
        throw new Error(`Yêu cầu thất bại với mã trạng thái: ${response.status}`);
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response || error); // Log lỗi chi tiết
      const errorMessage = error.response?.data?.message || error.message || "Thêm người dùng thất bại. Vui lòng kiểm tra lại thông tin.";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [formData, onUserAdded]);

  // Reset form khi mở modal
  const handleShow = () => {
    setFormData({
      name: "",
      email: "",
      birthDate: "",
      address: "",
      role: "CUSTOMER",
      password: "",
    });
    setErrors({});
  };

  return (
    <Modal show={show} onHide={onHide} onShow={handleShow} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Thêm người dùng mới</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Nhập tên"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Nhập email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBirthDate">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              isInvalid={!!errors.birthDate}
              max={new Date().toISOString().split('T')[0]} // Giới hạn ngày không vượt quá hôm nay
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
              placeholder="Nhập địa chỉ"
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              placeholder="Nhập mật khẩu"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          <Icon className="me-1">close</Icon> Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              Đang xử lý...
            </>
          ) : (
            <>
              <Icon className="me-1">save</Icon> Lưu
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserAddModal;