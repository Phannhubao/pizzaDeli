import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../css/detail.css";
import Swal from 'sweetalert2';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const mockProducts = [
      // Original products (ID 1-4)
      {
        id: 1,
        name: "Mỳ Ý Sốt Cua Cà Chua",
        price: 254000,
        tag: "4P's Đặc biệt",
        description: "3 Loại Phô Mai",
        image: "../img/pizza1.webp",
        details: "Mỳ Ý sốt cua cà chua thơm ngon với 3 loại phô mai Ý đặc trưng, kết hợp cùng thịt cua tươi ngon.",
        ingredients: ["Mỳ Ý", "Thịt cua", "Cà chua", "Phô mai Parmigiano", "Phô mai Mozzarella", "Phô mai Ricotta"],
        type: "Món chính"
      },
      {
        id: 2,
        name: "Pizza Nửa Vỉ",
        price: 198000,
        tag: "Mới",
        description: "2 hương vị tùy chọn",
        image: "../img/pizza2.webp",
        details: "Pizza đế mỏng giòn tan với nhân phong phú, bạn có thể chọn 2 hương vị khác nhau trên 1 vỉ.",
        ingredients: ["Bột bánh", "Sốt cà chua", "Phô mai Mozzarella", "Xúc xích Ý", "Ớt chuông", "Nấm"],
        type: "Món chính"
      },
      {
        id: 3,
        name: "Gà Rán Gia Vị Á 2 Miếng",
        price: 98000,
        tag: "",
        description: "",
        image: "../img/pizza3.webp",
        details: "Gà rán giòn với gia vị Á Độc đáo, ăn kèm sốt đặc biệt và đồ chua.",
        ingredients: ["Đùi gà", "Gia vị Á", "Bột chiên giòn", "Sốt đặc biệt"],
        type: "Món phụ"
      },
      {
        id: 4,
        name: "Pizza Nửa Vỉ",
        price: 198000,
        tag: "Mới",
        description: "2 hương vị tùy chọn",
        image: "../img/pizza4.webp",
        details: "Pizza đế mỏng giòn tan với nhân phong phú, bạn có thể chọn 2 hương vị khác nhau trên 1 vỉ.",
        ingredients: ["Bột bánh", "Sốt cà chua", "Phô mai Mozzarella", "Xúc xích Ý", "Ớt chuông", "Nấm"],
        type: "Món chính"
      },
    
      // Khai vi dishes (ID 5-10) - now with all fields
      {
        id: 5,
        name: "Salad Ý Trộn Sốt Mật Ong",
        price: 120000,
        tag: "Best Seller",
        description: "Rau tươi nhập khẩu",
        image: "../img/khaivi1.webp",
        details: "Salad tươi ngon với xà lách Romaine, cà chua bi, phô mai Parmigiano, sốt mật ong và dầu ô liu nguyên chất.",
        ingredients: ["Xà lách Romaine", "Cà chua bi", "Phô mai Parmigiano", "Sốt mật ong", "Dầu ô liu"],
        type: "Khai vị"
      },
      {
        id: 6,
        name: "Bruschetta Bò Bít Tết",
        price: 150000,
        tag: "Mới",
        description: "Bánh mì nướng tỏi",
        image: "../img/khaivi2.webp",
        details: "Bánh mì Ý nướng giòn phủ thịt bò bít tết thái mỏng, sốt pesto và phô mai Mozzarella.",
        ingredients: ["Bánh mì Ý", "Thịt bò bít tết", "Sốt pesto", "Phô mai Mozzarella", "Tỏi"],
        type: "Khai vị"
      },
      {
        id: 7,
        name: "Tôm Sốt Tỏi Chiên Giòn",
        price: 180000,
        tag: "Đặc biệt",
        description: "Tôm tươi size lớn",
        image: "../img/khaivi3.webp",
        details: "Tôm tươi chiên giòn với sốt tỏi thơm ngon, ăn kèm bánh mì tỏi.",
        ingredients: ["Tôm tươi", "Tỏi", "Bơ", "Bánh mì tỏi", "Gia vị Ý"],
        type: "Khai vị"
      },
      {
        id: 8,
        name: "Phô Mai Chiên Giòn Sốt Mận",
        price: 110000,
        tag: "Mới",
        description: "Phô mai Mozzarella",
        image: "../img/khaivi4.webp",
        details: "Phô mai Mozzarella chiên giòn bên ngoài, dẻo thơm bên trong, chấm cùng sốt mận đặc trưng.",
        ingredients: ["Phô mai Mozzarella", "Bột chiên giòn", "Sốt mận", "Rau thơm"],
        type: "Khai vị"
      },
      {
        id: 9,
        name: "Cánh Gà Sốt BBQ",
        price: 140000,
        tag: "",
        description: "6 cánh gà lớn",
        image: "../img/khaivi5.webp",
        details: "Cánh gà tẩm ướp gia vị đặc biệt, nướng với sốt BBQ tự làm, ăn kèm cần tây và sốt blue cheese.",
        ingredients: ["Cánh gà", "Sốt BBQ", "Cần tây", "Sốt blue cheese", "Gia vị"],
        type: "Khai vị"
      },
      {
        id: 10,
        name: "Bánh Mì Tỏi Phô Mai",
        price: 90000,
        tag: "Combo",
        description: "4 miếng lớn",
        image: "../img/khaivi6.webp",
        details: "Bánh mì Ý nướng giòn với tỏi, thảo mộc Ý và phô mai Parmesan, dùng nóng.",
        ingredients: ["Bánh mì Ý", "Tỏi", "Phô mai Parmesan", "Thảo mộc Ý", "Dầu ô liu"],
        type: "Khai vị"
      },
    
      // Drinks (ID 11-16) - already complete
      {
        id: 11,
        name: "Limonata Ý Truyền Thống",
        price: 65000,
        tag: "Best Seller",
        description: "Chanh tươi & bạc hà",
        image: "../img/nuoc1.webp",
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
        image: "../img/nuoc2.webp",
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
        image: "../img/nuoc3.webp",
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
        image: "../img/nuoc4.webp",
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
        image: "../img/nuoc5.webp",
        details: "Trà đen Ý ủ lạnh với đào tươi, cam slice và sả, vị ngọt thanh tự nhiên.",
        ingredients: ["Trà đen Ý", "Đào tươi", "Cam", "Sả"],
        type: "Trà"
      },
      {
        id: 16,
        name: "Soda Chanh Mật Ong",
        price: 60000,
        tag: "Combo",
        description: "Chanh tươi & mật ong",
        image: "../img/nuoc6.webp",
        details: "Soda Ý kết hợp chanh tươi và mật ong rừng, thức uống giải khát hoàn hảo.",
        ingredients: ["Soda Ý", "Chanh tươi", "Mật ong"],
        type: "Nước giải khát"
      }
    ];
    
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`);
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng',
      text: `${quantity} ${product.name} đã được thêm vào giỏ hàng`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#f8f9fa',
      iconColor: '#28a745',
      customClass: {
        title: 'swal-title',
        content: 'swal-text'
      }
    });
  };

  if (!product) return <div className="pd-loading">Loading...</div>;

  return (
    <div className="pd-container">
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Quay lại
      </button>
      <div className="pd-grid">
        <div className="pd-image-col">
        <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="pd-info-col">
          <h1 className="pd-product-title">{product.name}</h1>
          {product.tag && <span className="pd-product-tag">{product.tag}</span>}
          <p className="pd-product-price">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</p>
          
          <div className="pd-section">
            <h3 className="pd-section-title">Mô tả</h3>
            <p className="pd-section-content">{product.details}</p>
          </div>
          
          <div className="pd-section">
            <h3 className="pd-section-title">Thành phần</h3>
            <ul className="pd-ingredients-list">
              {product.ingredients.map((ingredient, index) => (
                <li key={index} className="pd-ingredient-item">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="pd-quantity-control">
            <button 
              className="pd-quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="pd-quantity-value">{quantity}</span>
            <button 
              className="pd-quantity-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button className="pd-add-to-cart-btn" onClick={handleAddToCart}>
            <FaPlus /> Thêm vào giỏ ({quantity})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;