import "../../css/style.css";
import "../../css/dataTables.bootstrap5.min.css";
import "../../AdminManager.css";
import "./UserManager.css"; // Thêm file CSS mới
import {
  GetUserList,
  PostBanUser,
  PostUnbanUser,
} from "../../../../../services/ApiService";
import { useEffect, useState, useCallback } from "react";
// import { Link } from "react-router-dom";
import { Icon } from "@mui/material";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import UserDetailModal from "./UserDetailModal";
import UserAddModal from "./UserAddModal";

export default function UserManager() {
  // State quản lý dữ liệu
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State quản lý modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Hàm fetch dữ liệu
  const fetchUsers = useCallback(async () => {
    try {
      const response = await GetUserList();
      const usersData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data) ? response.data.data : [];
      setUsers(usersData);
      setTotalUsers(usersData.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setUsers([]);
      setTotalUsers(0);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách người dùng",
      });
    }
  }, []);

  // Gọi API khi component mount hoặc khi refresh thay đổi
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refresh]);

  // Xử lý thay đổi trạng thái người dùng
  const handleChangeStatus = async (id, action) => {
    const currentUser = users.find((u) => u.id === id);
    if (!currentUser) return;

    let apiCall, successMessage;
    if (action === "ban") {
      apiCall = PostBanUser(id);
      successMessage = "Đã cấm người dùng thành công";
    } else if (action === "unban") {
      apiCall = PostUnbanUser(id);
      successMessage = "Đã bỏ cấm người dùng thành công";
    }

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: `Bạn chắc chắn muốn ${action === "ban" ? "cấm" : "bỏ cấm"} người dùng này?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await apiCall;
        if (response.status === 200) {
          const newStatus = action === "ban" ? "BANNED" : "ACTIVE";
          setUsers(
            users.map((user) =>
              user.id === id ? { ...user, status: newStatus } : user
            )
          );
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: successMessage,
            timer: 1500,
            showConfirmButton: false,
          });
          setRefresh(!refresh); // Làm mới danh sách
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Cập nhật trạng thái thất bại",
        });
      }
    }
  };

  // Xử lý mở modal chi tiết
  const handleOpenDetailModal = (userId) => {
    setSelectedUserId(userId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUserId(null);
  };

  // Xử lý mở và đóng modal thêm người dùng
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Callback khi thêm người dùng thành công
  const handleUserAdded = () => {
    setRefresh(!refresh); // Làm mới danh sách sau khi thêm
    handleCloseAddModal();
  };

  // Phân trang
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Lọc và tìm kiếm người dùng
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  console.log(totalUsers);

  // Tính toán người dùng hiển thị
  const offset = currentPage * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <main className="user-manager-container">
      <div className="container pt-4">
        {/* Header */}
        <div className="user-manager-header">
          <div className="user-manager-title">
            <h2>Quản lý người dùng</h2>
            <p className="user-count">Tổng: {filteredUsers.length} người dùng</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-add-user"
          >
            <Icon>person_add</Icon>
            <span>Thêm người dùng</span>
          </button>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="user-filter-section">
          <div className="search-box">
            <Icon>search</Icon>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="BANNED">Bị cấm</option>
            </select>
          </div>
        </div>

        {/* Bảng người dùng */}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Thông tin người dùng</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={user.status === "BANNED" ? "banned-user" : ""}
                  >
                    <td className="user-index">{offset + index + 1}</td>
                    <td className="user-info">
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name || "Không có"}</div>
                        <div className="user-birthdate">{user.birthDate || "Không có"}</div>
                      </div>
                    </td>
                    <td className="user-email">{user.email || "Không có"}</td>
                    <td className="user-address">{user.address || "Không có"}</td>
                    <td className="user-status">
                      <span className={`status-badge ${user.status === "ACTIVE" ? "active" : "banned"}`}>
                        {user.status === "ACTIVE" ? "Hoạt động" : "Bị cấm"}
                      </span>
                    </td>
                    <td className="user-role">
                      <span className="role-badge">{user.role || "Không xác định"}</span>
                    </td>
                    <td className="user-actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleOpenDetailModal(user.id)}
                          className="btn-action btn-view"
                          title="Xem chi tiết"
                        >
                          <Icon>visibility</Icon>
                        </button>
                        {user.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleChangeStatus(user.id, "ban")}
                            className="btn-action btn-ban"
                            title="Cấm người dùng"
                          >
                            <Icon>block</Icon>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleChangeStatus(user.id, "unban")}
                            className="btn-action btn-unban"
                            title="Bỏ cấm người dùng"
                          >
                            <Icon>check_circle</Icon>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-users">
                    <div className="no-users-content">
                      <Icon>group</Icon>
                      <p>Không tìm thấy người dùng nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {pageCount > 1 && (
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={<Icon>chevron_left</Icon>}
              nextLabel={<Icon>chevron_right</Icon>}
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
            />
          </div>
        )}

        {/* Modal chi tiết người dùng */}
        <UserDetailModal
          show={showDetailModal}
          onHide={handleCloseDetailModal}
          userId={selectedUserId}
        />

        {/* Modal thêm người dùng */}
        <UserAddModal
          show={showAddModal}
          onHide={handleCloseAddModal}
          onUserAdded={handleUserAdded}
        />
      </div>
    </main>
  );
}