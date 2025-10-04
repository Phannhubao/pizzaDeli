import "../../css/style.css";
import "../../css/dataTables.bootstrap5.min.css";
import "../../AdminManager.css";
import "./OrderManager.css";
import { useEffect, useState, useCallback } from "react";
import { GetAllOrders, PutOrderStatus } from "../../../../../services/ApiService";
import { Icon } from "@mui/material";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(12);
  const [refresh, setRefresh] = useState(false);

  // Hàm fetch dữ liệu đơn hàng
  const fetchOrders = useCallback(async () => {
    try {
      const response = await GetAllOrders();
      let ordersData = [];
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (Array.isArray(response.data?.data)) {
          ordersData = response.data.data;
        }
      }
      // Chuẩn hóa và lọc dữ liệu
      ordersData = ordersData
        .map((order) => ({
          ...order,
          id: order.id || order.orderId, // Fallback to orderId if id is missing
        }))
        .filter((order) => order.id && !isNaN(Number(order.id))); // Loại bỏ đơn hàng có id không hợp lệ
      console.log("Filtered Orders Data:", ordersData); // Debug log
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setTotalOrders(ordersData.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
      setFilteredOrders([]);
      setTotalOrders(0);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách đơn hàng",
      });
    }
  }, []);

  // Gọi API khi component mount hoặc khi refresh thay đổi
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refresh]);

  // Lọc đơn hàng theo tên người đặt hoặc trạng thái
  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    setFilteredOrders(filtered);
    setTotalOrders(filtered.length);
    setCurrentPage(0); // Reset về trang đầu khi lọc
  }, [searchTerm, statusFilter, orders]);

  // Định dạng trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case "PROCESSING":
        return "status-processing";
      case "PENDING":
        return "status-pending";
      case "COMPLETED":
        return "status-completed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  // Định dạng tiền tệ theo chuẩn Việt Nam
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + " ₫" : "0 ₫";
  };

  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId || orderId === "undefined" || isNaN(Number(orderId))) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "ID đơn hàng không hợp lệ",
      });
      return;
    }

    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy đơn hàng",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const numericId = Number(orderId); // Chuyển đổi sang số
        const response = await PutOrderStatus(numericId, newStatus); // Gửi status dưới dạng chuỗi
        if (response.status === 200) {
          setRefresh(!refresh); // Tải lại dữ liệu
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã cập nhật trạng thái đơn hàng",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Cập nhật trạng thái thất bại",
        });
      }
    }
  };

  // Phân trang
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <main className="order-manager-container">
      <div className="container pt-4">
        {/* Header */}
        <div className="header d-flex align-items-center justify-content-between mb-4">
          <div className="text-secondary">Tổng: {totalOrders} đơn hàng</div>
          <h2 className="text-center font-weight-bold mb-0">QUẢN LÝ ĐƠN HÀNG</h2>
          <div></div> {/* Placeholder để cân đối layout */}
        </div>

        {/* Search bar */}
        <div className="search-container mb-4">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên người đặt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="search-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Bảng đơn hàng */}
        <div className="table-responsive" style={{ minHeight: "600px" }}>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Tên người đặt</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thay đổi trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((item, index) => (
                  <tr key={item.id || `order-${index}`}>
                    <td>{offset + index + 1}</td>
                    <td>{item.username || "Không có"}</td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>{formatCurrency(item.totalPrice)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(item.status)}`}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {item.status === "COMPLETED" || item.status === "CANCELLED" ? (
                        <span
                          className={`status-badge ${getStatusClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                      ) : (
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="search-select"
                        >
                          <option value="PENDING">Chờ xác nhận</option>
                          <option value="PROCESSING">Đang xử lý</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    <div className="no-orders-content">
                      <Icon className="no-orders-icon">shopping_cart</Icon>
                      <p>Không có đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {pageCount > 1 && (
          <div className="pagination-container d-flex justify-content-center mt-4">
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
      </div>
    </main>
  );
}