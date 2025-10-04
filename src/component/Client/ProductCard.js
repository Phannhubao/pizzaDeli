import React from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ProductCard = ({ product, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product || !product.productId) {
      console.error("Product or productId không hợp lệ:", product);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Sản phẩm không hợp lệ",
        showConfirmButton: true,
      });
      return;
    }

    // Lấy giỏ hàng hiện tại từ localStorage
    let savedCart;
    try {
      savedCart = localStorage.getItem("pizza4ps_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      console.log("Current cart from localStorage:", cart);

      // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
      const existingItem = cart.find((item) => item.productId === product.productId);
      if (existingItem) {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Sản phẩm đã có trong giỏ",
          text: `${product.productName} đã có trong giỏ hàng`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        return;
      }

      // Thêm sản phẩm vào giỏ hàng
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      console.log("Updated cart before save:", updatedCart);

      // Lưu vào localStorage
      localStorage.setItem("pizza4ps_cart", JSON.stringify(updatedCart));
      console.log("localStorage set with:", JSON.stringify(updatedCart));

      // Xác nhận dữ liệu đã lưu
      const savedAfter = localStorage.getItem("pizza4ps_cart");
      console.log("Data in localStorage after save:", savedAfter ? JSON.parse(savedAfter) : null);

      // Hiển thị thông báo thành công mà không điều hướng
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Đã thêm vào giỏ hàng",
        text: `${product.productName} đã được thêm vào giỏ hàng`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#f8f9fa",
        iconColor: "#28a745",
      });
    } catch (error) {
      console.error("Error handling cart:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="product-card">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <div className="product-image-container">
          <img
            src={product.image?.startsWith("../") ? product.image.substring(2) : product.image || "img/default-product.png"}
            alt={product.productName || "Product Image"}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.productName || "Unnamed Product"}</h3>
          <p className="product-description">{product.description || "No description"}</p>
          <div className="d-flex justify-content-between align-items-center">
            <p className="product-price mb-0">{formatPrice(product.price || 0)}</p>
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;