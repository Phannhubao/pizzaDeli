import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/menu.css";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://pizzadelife.onrender.com/api/categories")
      .then((response) => {
        console.log("API Data:", response.data);
        const data = response.data.data || response.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Chuyển đến trang sản phẩm với categoryId
    navigate(`/products?categoryId=${categoryId}`);
  };

  return (
    <div className="container text-center menu1">
      <div className="row">
        {categories.map((category) => (
          <div 
            className="col" 
            key={category.categoryId}
            onClick={() => handleCategoryClick(category.categoryId)}
            style={{ cursor: "pointer" }} // Thêm hiệu ứng con trỏ
          >
            <div className="menu-title">{category.categoryName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;