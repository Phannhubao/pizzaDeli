import { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Icon } from "@mui/material";
import { GetProductByID, GetImageByProductId, GetCategoryList } from "../../../../../services/ApiService";
import Swal from "sweetalert2";

const ProductDetailModal = ({ show, onHide, productId }) => {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    product: false,
    images: false,
    categories: false,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Hàm lấy tên danh mục từ categoryId
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Không có danh mục";
    const category = categories.find(
      (cat) => cat.id === categoryId || cat._id === categoryId || cat.categoryId === categoryId
    );
    return category?.categoryName || category?.name || "Không xác định";
  };

  // Fetch chi tiết sản phẩm
  const fetchProductDetails = useCallback(async () => {
    setLoading((prev) => ({ ...prev, product: true }));
    try {
      const response = await GetProductByID(productId);
      if (response.status === 200) {
        setProduct(response.data);
      } else {
        throw new Error("Không thể tải chi tiết sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading((prev) => ({ ...prev, product: false }));
    }
  }, [productId]);

  // Fetch hình ảnh sản phẩm
  const fetchProductImages = useCallback(async () => {
    setLoading((prev) => ({ ...prev, images: true }));
    try {
      const response = await GetImageByProductId(productId);
      console.log("Images data from API (raw):", response.data); // Debug dữ liệu thô
      const imagesData = Array.isArray(response.data) ? response.data : [];
      console.log("Processed images data:", imagesData); // Debug dữ liệu đã xử lý

      // Xử lý dữ liệu ảnh, ưu tiên ảnh isPrimary mới nhất
      const validImages = imagesData.map((img) => ({
        imageId: img.imageId || img.id || Date.now(),
        imageUrl: img.imageUrl || "img/default-product.png",
        caption: img.caption || null,
        isPrimary: img.isPrimary || false,
        createdAt: img.createdAt || new Date().toISOString(),
        productId: img.productId || productId,
      }));

      setImages(validImages);

      // Tìm ảnh isPrimary mới nhất dựa trên createdAt
      const primaryImages = validImages.filter((img) => img.isPrimary);
      if (primaryImages.length > 0) {
        const latestPrimary = primaryImages.reduce((latest, current) =>
          new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current
        );
        setActiveImageIndex(validImages.findIndex((img) => img.imageId === latestPrimary.imageId));
      }
    } catch (error) {
      console.error("Lỗi khi lấy hình ảnh sản phẩm:", error);
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Không thể tải hình ảnh sản phẩm",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading((prev) => ({ ...prev, images: false }));
    }
  }, [productId]);

  // Fetch danh sách danh mục
  const fetchCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const response = await GetCategoryList();
      const categoriesData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Không thể tải danh sách danh mục",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, []);

  useEffect(() => {
    if (show && productId) {
      fetchProductDetails();
      fetchProductImages();
      fetchCategories();
    } else {
      // Reset state khi đóng modal
      setProduct(null);
      setImages([]);
      setActiveImageIndex(0);
    }
  }, [show, productId, fetchProductDetails, fetchProductImages, fetchCategories]);

  // Xử lý chuyển ảnh
  const handleThumbnailClick = (index) => setActiveImageIndex(index);
  const handlePrevImage = () =>
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNextImage = () =>
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {loading.product ? "Đang tải..." : `Chi tiết sản phẩm #${productId}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0">
        {loading.product ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Đang tải thông tin sản phẩm...</p>
          </div>
        ) : product ? (
          <div className="row g-4">
            {/* Cột hình ảnh */}
            <div className="col-md-6">
              <div className="sticky-top" style={{ top: "20px" }}>
                {loading.images ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading images...</span>
                    </div>
                  </div>
                ) : images.length > 0 ? (
                  <div className="product-image-gallery">
                    <div className="main-image-container position-relative mb-3">
                      <img
                        src={images[activeImageIndex]?.imageUrl || "img/default-product.png"}
                        alt={`${product.productName} ${activeImageIndex + 1}`}
                        className="img-fluid rounded-3 border"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.src = "img/default-product.png";
                          console.error("Image failed to load:", images[activeImageIndex]?.imageUrl);
                        }}
                      />
                      {images.length > 1 && (
                        <>
                          <Button
                            variant="light"
                            className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow-sm"
                            onClick={handlePrevImage}
                          >
                            <Icon>chevron_left</Icon>
                          </Button>
                          <Button
                            variant="light"
                            className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 shadow-sm"
                            onClick={handleNextImage}
                          >
                            <Icon>chevron_right</Icon>
                          </Button>
                        </>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="thumbnails-container d-flex gap-2 overflow-auto py-2">
                        {images.map((image, index) => (
                          <div
                            key={image.imageId}
                            onClick={() => handleThumbnailClick(index)}
                            className={`thumbnail-item ${index === activeImageIndex ? "active" : ""}`}
                            style={{
                              cursor: "pointer",
                              border: index === activeImageIndex ? "2px solid #0d6efd" : "1px solid #dee2e6",
                            }}
                          >
                            <img
                              src={image.imageUrl || "img/default-product.png"}
                              alt={`Thumbnail ${index + 1}`}
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src = "img/default-product.png";
                                console.error("Thumbnail failed to load:", image.imageUrl);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5 bg-light rounded-3">
                    <Icon fontSize="large" className="text-muted">image</Icon>
                    <p className="mt-2 text-muted">Sản phẩm chưa có hình ảnh</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột thông tin */}
            <div className="col-md-6">
              <div className="product-details">
                <h2 className="mb-3 fw-bold">{product.productName}</h2>

                {/* Giá */}
                <div className="price-section mb-4">
                  <h3 className="text-danger fw-bold mb-1">
                    {product.price?.toLocaleString("vi-VN")}₫
                  </h3>
                  {product.discount > 0 && (
                    <div className="d-flex align-items-center">
                      <span className="text-muted text-decoration-line-through me-2">
                        {(product.price * (1 + product.discount / 100))?.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="badge bg-danger fs-6">-{product.discount}%</span>
                    </div>
                  )}
                </div>

                {/* Thông tin cơ bản */}
                <div className="basic-info mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">category</Icon>
                    <span>
                      <strong>Danh mục:</strong> {getCategoryName(product.categoryId)}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">inventory</Icon>
                    <span>
                      <strong>Tồn kho:</strong> {product.stock}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon className="me-2 text-muted">event</Icon>
                    <span>
                      <strong>Ngày tạo:</strong>{" "}
                      {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Icon className="me-2 text-muted">visibility</Icon>
                    <span>
                      <strong>Trạng thái:</strong>{" "}
                      <span className={`badge ${product.active ? "bg-success" : "bg-secondary"}`}>
                        {product.active ? "Đang bán" : "Ngừng kinh doanh"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="description-section mb-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <Icon className="me-2">description</Icon>
                    Mô tả sản phẩm
                  </h5>
                  <div className="bg-light p-3 rounded-2">
                    {product.description ? (
                      <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-muted mb-0">Chưa có mô tả</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <Icon fontSize="large" className="text-muted">error</Icon>
            <p className="mt-2 text-muted">Không tìm thấy thông tin sản phẩm</p>
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

export default ProductDetailModal;