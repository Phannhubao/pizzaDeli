import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from '../../component/Client/Banner'; 

import Menu from '../../component/Client/Menu';
import ProductList from "./ProductList";
function Home() {
  return (
   <div className="container-fluid">
   <Banner/>
   <br></br>
   <br></br>
   <Menu/>
   <br></br>
   <br></br>
  <ProductList></ProductList>
   </div>
  );
}

export default Home;
