import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from '../component/Banner'; 
import ProductList from '../component/ProductList';  
import Menu from '../component/Menu';
function Home() {
  return (
   <div className="container-fluid">
   <Banner/>
   <br></br>
   <br></br>
   <Menu/>
   <br></br>
   <br></br>
   <ProductList/>
   </div>
  );
}

export default Home;
