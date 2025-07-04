import "./App.css";
import Header from "./component/Header";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./component/Footer";
import Home from './component/Home';  
import Contact from './component/Contact';  
import ProductDetail from './component/ProductDetail'; 
import About from './component/About';  
import Signup from './component/RegisterPage';  
import Cart from './component/Cart';  
import ProductList from './component/ProductList';  
function App() {
  return (
     <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home/>} />  
            <Route path="/contact" element={<Contact/>} />  
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About/>} />  
            <Route path="/Signup" element={<Signup/>} />  
            <Route path="/cart" element={<Cart/>} />  
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
   
  );
}

export default App;
