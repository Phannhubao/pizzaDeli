import "../../css/style.css";
import "../../css/dataTables.bootstrap5.min.css";
import "./ProductManager.css";
import { GetProductList, PutProductActive, GetCategoryList, DeleteProduct } from "../../../../../services/ApiService";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@mui/material";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import ImageUploadModal from "./ImageUploadModal";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductManager() {
  // State quản lý dữ liệu
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(12);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // State quản lý modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

  // Hàm fetch dữ liệu
  const fetchProducts = useCallback(async () => {
    try {
      const response = await GetProductList();
      const productsData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setTotalProducts(productsData.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      setProducts([]);
      setFilteredProducts([]);
      setTotalProducts(0);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách sản phẩm",
      });
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await GetCategoryList();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      setCategories([]);
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Không thể tải danh sách danh mục",
        timer: 1500
      });
    }
  }, []);

  // Gọi API khi component mount hoặc khi refresh thay đổi
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories, refresh]);

  // Lọc sản phẩm theo tên hoặc danh mục
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((product) => product.categoryId === categoryFilter);
    }
    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurrentPage(0); // Reset về trang đầu khi lọc
  }, [searchTerm, categoryFilter, products]);

  // Hàm helper
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Không có";
    
    const category = categories.find(
      cat => cat.id === categoryId || 
             cat._id === categoryId || 
             cat.categoryId === categoryId
    );
    
    return category ? category.categoryName : "Không xác định";
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + " ₫" : "0 ₫";
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      try {
        const response = await DeleteProduct(id);
        if (response.status === 200) {
          setRefresh(!refresh);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã xóa sản phẩm thành công",
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Xóa sản phẩm thất bại"
        });
      }
    }
  };

  // Xử lý thay đổi trạng thái sản phẩm
  const handleChangeStatus = async (id) => {
    const currentProduct = products.find((p) => p.productId === id);
    if (!currentProduct) return;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: "Bạn chắc chắn muốn thay đổi trạng thái sản phẩm?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      try {
        const newActiveStatus = !currentProduct.active;
        const response = await PutProductActive(id, newActiveStatus);
        
        if (response.status === 200) {
          setRefresh(!refresh);
          Swal.fire({ 
            icon: "success", 
            title: "Thành công", 
            text: "Đã cập nhật trạng thái",
            timer: 1500,
            showConfirmButton: false 
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        Swal.fire({ 
          icon: "error", 
          title: "Lỗi", 
          text: error.response?.data?.message || "Cập nhật thất bại" 
        });
      }
    }
  };

  // Xử lý modal
  const handleOpenImageModal = (productId) => {
    setSelectedProductId(productId);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedProductId(null);
  };

  const handleOpenDetailModal = (productId) => {
    setSelectedProductDetailId(productId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProductDetailId(null);
  };

  // Phân trang
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Tính toán sản phẩm hiển thị
  const offset = currentPage * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <main className="product-manager-container">
      <div className="container pt-4">
        {/* Header */}
        <div className="header d-flex align-items-center justify-content-between mb-4">
          <div className="text-secondary">Tổng: {totalProducts} sản phẩm</div>
          <h2 className="text-center font-weight-bold mb-0">QUẢN LÝ SẢN PHẨM</h2>
          <Link to="create" className="btn btn-danger rounded d-flex align-items-center">
            <Icon>add</Icon>
            <span className="ms-1">Thêm sản phẩm</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="search-container mb-4">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="search-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option
                key={category.categoryId || category.id || category._id}
                value={category.categoryId || category.id || category._id}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Bảng sản phẩm */}
        <div className="table-responsive" style={{ minHeight: "600px" }}>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <tr
                    key={product.productId}
                    className={!product.active ? "table-secondary" : ""}
                  >
                    <td>{offset + index + 1}</td>
                    <td>{product.productName || "Không có"}</td>
                    <td>{getCategoryName(product.categoryId)}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={product.active}
                          onChange={() => handleChangeStatus(product.productId)}
                          style={{ width: "3em", height: "1.5em" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link 
                          to={`update/${product.productId}`} 
                          className="btn btn-sm btn-primary"
                          title="Chỉnh sửa"
                        >
                          <Icon fontSize="small">edit</Icon>
                        </Link>
                        <button 
                          onClick={() => handleOpenDetailModal(product.productId)}
                          className="btn btn-sm btn-info text-white"
                          title="Xem chi tiết"
                        >
                          <Icon fontSize="small">visibility</Icon>
                        </button>
                        <button 
                          onClick={() => handleOpenImageModal(product.productId)}
                          className="btn btn-sm btn-success"
                          title="Thêm ảnh"
                        >
                          <Icon fontSize="small">image</Icon>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="btn btn-sm btn-danger"
                          title="Xóa sản phẩm"
                        >
                          <Icon fontSize="small">delete</Icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    <div className="no-products-content">
                      <Icon className="no-products-icon">inventory_2</Icon>
                      <p>Không tìm thấy sản phẩm nào</p>
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

        {/* Modal upload ảnh */}
        <ImageUploadModal
          show={showImageModal}
          onHide={handleCloseImageModal}
          productId={selectedProductId}
          onUploadSuccess={() => setRefresh(!refresh)}
        />

        {/* Modal chi tiết sản phẩm */}
        <ProductDetailModal
          show={showDetailModal}
          onHide={handleCloseDetailModal}
          productId={selectedProductDetailId}
        />
      </div>
    </main>
  );
}