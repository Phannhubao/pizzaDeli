import React from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const pid = product?.productId ?? product?.id;
    if (!product || pid === undefined || pid === null) {
      console.error("Product or productId không hợp lệ:", product);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Sản phẩm không hợp lệ",
        showConfirmButton: true,
      });
      return;
    }

    try {
      addToCart(product, 1);

      // Hiển thị thông báo thành công
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Đã thêm vào giỏ hàng",
        text: `${product.productName || product.name || 'Sản phẩm'} đã được thêm vào giỏ hàng`,
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