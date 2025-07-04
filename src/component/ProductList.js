import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ProductList.css";
import ProductCard from "./ProductCard";
import Swal from 'sweetalert2';
const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy categoryId từ URL
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");

  // Hàm lấy ảnh cho từng sản phẩm
  const fetchProductImages = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/images/product/${productId}`);
      console.log(`Images for product ${productId}:`, response.data); // Debug response
      if (response.data && response.data.length > 0) {
        return response.data[0].imageUrl; // Lấy ảnh đầu tiên
      }
      return null;
    } catch (err) {
      console.error(`Error fetching images for product ${productId}:`, err.response?.data || err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API lấy sản phẩm
        let url = "http://localhost:8080/api/products";
        if (categoryId) {
          url += `/category/${categoryId}`;
        }

        const response = await axios.get(url);
        console.log("Products response:", response.data); // Debug response
        const productsData = Array.isArray(response.data) ? response.data : [];

        // Lấy ảnh cho từng sản phẩm
        const imagesMap = {};
        for (const product of productsData) {
          const imageUrl = await fetchProductImages(product.productId);
          imagesMap[product.productId] = imageUrl;
        }

        // Cập nhật sản phẩm với ảnh
        const processedProducts = productsData.map((product) => ({
          ...product,
          image: imagesMap[product.productId] || "img/default-product.png",
        }));

        setProducts(processedProducts);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
        setError("Không thể tải danh sách sản phẩm");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);


  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    const productToAdd = products.find(product => product.productId === productId);

    if (!productToAdd) {
      console.error("Product not found:", productId);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tìm thấy sản phẩm',
      });
      return;
    }

    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Sản phẩm đã có trong giỏ',
        text: `${productToAdd.productName} đã có trong giỏ hàng`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      return;
    }

    setCart([...cart, {...productToAdd, quantity: 1}]);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng',
      text: `${productToAdd.productName} đã được thêm vào giỏ hàng`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#f8f9fa',
      iconColor: '#28a745'
    });
    console.log(`Added product ${productId} to cart`, productToAdd);
  };

  if (isLoading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-link" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container product-list-container">
      <h1 className="section-title">
        {categoryId ? `Sản phẩm theo danh mục` : `Tất cả sản phẩm`}
      </h1>

      {products.length === 0 && !isLoading ? (
        <div className="text-center my-5">
          <p>Không tìm thấy sản phẩm nào</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </button>
        </div>
      ) : (
        <div className="row">
        {products
          .filter(product => product.active) // Lọc chỉ hiển thị sản phẩm active
          .map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
               onAddToCart={handleAddToCart}
              onClick={() => navigate(`/product/${product.productId}`)}
            />
          ))}
      </div>
      )}
    </div>
  );
};

export default ProductList;