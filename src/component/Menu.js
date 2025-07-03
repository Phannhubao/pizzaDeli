import React from "react";
import "../css/menu.css";

const Menu = () => {
  const items = [
    { title: "Bánh pizza", imgSrc: "img/pizza1.webp" },
    { title: "Khai vị", imgSrc: "img/khaivi1.webp" },
    { title: "Salad", imgSrc: "img/salad1.webp" },
    { title: "Mì ý", imgSrc: "img/miy1.webp" },
    { title: "Thức uống", imgSrc: "img/nuoc1.webp" },
    { title: "Tráng miệng", imgSrc: "img/trangmieng1.webp" },
  ];

  return (
    <div className="container text-center menu1">
      <div className="row">
        {items.map((item, index) => (
          <div className="col" key={index}>
            <img src={item.imgSrc} alt={item.title} className="menu-icon" />
            <div className="menu-title">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
