import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ProductList.css";
import Swal from 'sweetalert2';
import ProductCard from "./ProductCard";
const ProductList = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: "Mỳ Ý Sốt Cua Cà Chua",
      price: 254000,
      tag: "4P's Đặc biệt",
      description: "3 Loại Phô Mai",
      image: "img/pizza1.webp",
      details: "Mỳ Ý sốt cua cà chua thơm ngon với 3 loại phô mai Ý đặc trưng, kết hợp cùng thịt cua tươi ngon."
    },
    {
      id: 2,
      name: "Pizza Nửa Vỉ",
      price: 198000,
      tag: "Mới",
      description: "",
      image: "img/pizza2.webp",
      details: "Pizza đế mỏng giòn tan với nhân phong phú, bạn có thể chọn 2 hương vị khác nhau trên 1 vỉ."
    },
    {
      id: 3,
      name: "Gà Rán Gia Vị Á 2 Miếng",
      price: 98000,
      tag: "",
      description: "",
      image: "../img/pizza3.webp",
      details: "Gà rán giòn với gia vị Á Độc đáo, ăn kèm sốt đặc biệt và đồ chua."
    },
    {
      id: 4,
      name: "Pizza Nửa Vỉ",
      price: 198000,
      tag: "Mới",
      description: "",
      image: "../img/pizza4.webp",
      details: "Pizza đế mỏng giòn tan với nhân phong phú, bạn có thể chọn 2 hương vị khác nhau trên 1 vỉ."
    }
  ];
  const khaivi = [
    {
      id: 5,  // Bắt đầu từ 5
      name: "Salad Ý Trộn Sốt Mật Ong",
      price: 120000,
      tag: "Best Seller",
      description: "Rau tươi nhập khẩu",
      image: "img/khaivi1.webp",
      details: "Salad tươi ngon với xà lách Romaine, cà chua bi, phô mai Parmigiano, sốt mật ong và dầu ô liu nguyên chất."
    },
    {
      id: 6,  // Tiếp theo là 6
      name: "Bruschetta Bò Bít Tết",
      price: 150000,
      tag: "Mới",
      description: "Bánh mì nướng tỏi",
      image: "img/khaivi2.webp",
      details: "Bánh mì Ý nướng giòn phủ thịt bò bít tết thái mỏng, sốt pesto và phô mai Mozzarella."
    },
    {
      id: 7,  // Và cứ thế tăng dần...
      name: "Tôm Sốt Tỏi Chiên Giòn",
      price: 180000,
      tag: "Đặc biệt",
      description: "Tôm tươi size lớn",
      image: "img/khaivi3.webp",
      details: "Tôm tươi chiên giòn với sốt tỏi thơm ngon, ăn kèm bánh mì tỏi."
    },
    {
      id: 8,
      name: "Phô Mai Chiên Giòn Sốt Mận",
      price: 110000,
      tag: "Mới",
      description: "Phô mai Mozzarella",
      image: "img/khaivi4.webp",
      details: "Phô mai Mozzarella chiên giòn bên ngoài, dẻo thơm bên trong, chấm cùng sốt mận đặc trưng."
    },
    {
      id: 9,
      name: "Cánh Gà Sốt BBQ",
      price: 140000,
      tag: "",
      description: "6 cánh gà lớn",
      image: "img/khaivi5.webp",
      details: "Cánh gà tẩm ướp gia vị đặc biệt, nướng với sốt BBQ tự làm, ăn kèm cần tây và sốt blue cheese."
    },
    {
      id: 10,  // Kết thúc ở 10
      name: "Bánh Mì Tỏi Phô Mai",
      price: 90000,
      tag: "Combo",
      description: "4 miếng lớn",
      image: "img/khaivi6.webp",
      details: "Bánh mì Ý nướng giòn với tỏi, thảo mộc Ý và phô mai Parmesan, dùng nóng."
    }
  ];
  const drinks = [
    {
      id: 11,  // Bắt đầu từ 11
      name: "Limonata Ý Truyền Thống",
      price: 65000,
      tag: "Best Seller",
      description: "Chanh tươi & bạc hà",
      image: "img/nuoc1.webp",
      details: "Nước chanh Ý cổ điển với chanh tươi vắt, lá bạc hà và ít đường, mang lại vị thanh mát tự nhiên.",
      ingredients: ["Chanh tươi", "Lá bạc hà", "Đường mía", "Nước khoáng"],
      type: "Nước giải khát"
    },
    {
      id: 12,
      name: "Espresso Romano",
      price: 75000,
      tag: "Đặc biệt",
      description: "Cà phê Ý & chanh",
      image: "img/nuoc2.webp",
      details: "Espresso nguyên chất kèm miếng chanh tươi, hương vị độc đáo pha trộn giữa đắng và chua dịu.",
      ingredients: ["Cà phê Arabica", "Chanh tươi"],
      type: "Cà phê"
    },
    {
      id: 13,
      name: "Sữa Dê Nóng",
      price: 85000,
      tag: "Mới",
      description: "Sữa dê tươi nguyên chất",
      image: "img/nuoc3.webp",
      details: "Sữa dê hữu cơ ấm nóng với lớp bọt mịn, thêm chút mật ong rừng tự nhiên.",
      ingredients: ["Sữa dê tươi", "Mật ong"],
      type: "Đồ uống nóng"
    },
    {
      id: 14,
      name: "Aperol Spritz",
      price: 120000,
      tag: "Signature",
      description: "Rượu vang & cam",
      image: "img/nuoc4.webp",
      details: "Cocktail truyền thống Ý với Aperol, Prosecco và nước khoáng, trang trí lát cam tươi.",
      ingredients: ["Rượu Aperol", "Rượu Prosecco", "Cam tươi", "Nước khoáng"],
      type: "Cocktail"
    },
    {
      id: 15,
      name: "Trà Đào Cam Sả",
      price: 70000,
      tag: "",
      description: "Trà Ý & đào tươi",
      image: "img/nuoc5.webp",
      details: "Trà đen Ý ủ lạnh với đào tươi, cam slice và sả, vị ngọt thanh tự nhiên.",
      ingredients: ["Trà đen Ý", "Đào tươi", "Cam", "Sả"],
      type: "Trà"
    },
    {
      id: 16,  // Kết thúc ở 16
      name: "Soda Chanh Mật Ong",
      price: 60000,
      tag: "Combo",
      description: "Chanh tươi & mật ong",
      image: "img/nuoc6.webp",
      details: "Soda Ý kết hợp chanh tươi và mật ong rừng, thức uống giải khát hoàn hảo.",
      ingredients: ["Soda Ý", "Chanh tươi", "Mật ong"],
      type: "Nước giải khát"
    }
  ];

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    const productToAdd = [...products, ...khaivi, ...drinks].find(p => p.id === productId);
    
    if (productToAdd) {
      setCart([...cart, productToAdd]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Đã thêm vào giỏ hàng',
        text: `${productToAdd.name} đã được thêm vào giỏ hàng`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8f9fa',
        iconColor: '#28a745'
      });
      console.log(`Added product ${productId} to cart`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tìm thấy sản phẩm',
      });
    }
  };


  return (
    <div className="container product-list-container">
      <h1 className="section-title">Món Pizza  Nên Thử</h1>
      <div className="row">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
      <h1 className="section-title">Món Nên Thử</h1>
      <div className="row">
        {khaivi.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
      <h1 className="section-title">Món Nên Thử</h1>
      <div className="row">
        {drinks.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;