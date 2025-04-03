import React from "react";
import { FaPlus } from "react-icons/fa";

const ProductCard = ({ product, onAddToCart, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="product-card">
        {product.tag && (
          <span className="product-tag">{product.tag}</span>
        )}
        <div className="product-image-container">
          <img
            src={product.image.startsWith('../') ? product.image.substring(2) : product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <p className="product-price mb-0">{formatPrice(product.price)}</p>
            <button 
              className="btn-add-to-cart"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id, e);
              }}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;