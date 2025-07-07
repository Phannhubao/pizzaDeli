import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from '../component/Banner'; 

import Menu from '../component/Menu';
import AllProduct from "./AllProduct";
function Home() {
  return (
   <div className="container-fluid">
   <Banner/>
   <br></br>
   <br></br>
   <Menu/>
   <br></br>
   <br></br>
  <AllProduct></AllProduct>
   </div>
  );
}

export default Home;
