import { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Icon } from "@mui/material";
import { GetUserByID } from "../../../../../services/ApiService";
import Swal from "sweetalert2";

const UserDetailModal = ({ show, onHide, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch chi tiết người dùng
  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetUserByID(userId);
      if (response.status === 200) {
        setUser(response.data);
      } else {
        throw new Error("Không thể tải chi tiết người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết người dùng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (show && userId) {
      fetchUserDetails();
    } else {
      setUser(null);
    }
  }, [show, userId, fetchUserDetails]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {loading ? "Đang tải..." : `Chi tiết người dùng #${userId}`}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Đang tải thông tin người dùng...</p>
          </div>
        ) : user ? (
          <div className="row g-4">
            {/* Cột thông tin */}
            <div className="col-12">
              <div className="user-details">
                <h2 className="mb-3 fw-bold">{user.name || "Không có tên"}</h2>
                
                {/* Thông tin cơ bản */}
                <div className="basic-info mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">email</Icon>
                    <span>
                      <strong>Email:</strong> {user.email || "Không có"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">cake</Icon>
                    <span>
                      <strong>Ngày sinh:</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "Không có"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">location_on</Icon>
                    <span>
                      <strong>Địa chỉ:</strong> {user.address || "Không có"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">shield</Icon>
                    <span>
                      <strong>Vai trò:</strong> {user.role || "Không xác định"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Icon className="me-2 text-muted">visibility</Icon>
                    <span>
                      <strong>Trạng thái:</strong>{" "}
                      <span className={`badge ${user.status === "ACTIVE" ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status === "ACTIVE" ? "Hoạt động" : "Bị cấm"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <Icon fontSize="large" className="text-muted">error</Icon>
            <p className="mt-2 text-muted">Không tìm thấy thông tin người dùng</p>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          <Icon className="me-1">close</Icon> Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;