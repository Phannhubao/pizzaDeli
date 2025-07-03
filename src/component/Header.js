import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaPizzaSlice, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import '../css/header.css';

const Header = () => {
  const cartItemsCount = 0;
  return (
    <Navbar expand="lg" className="bg-navy shadow-sm py-3 headertop">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-light d-flex align-items-center">
          <FaPizzaSlice size={24} className="me-2" />
          Pizza Deli
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-light fw-bold">
              HOME
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-light">
              ABOUT
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="text-light">
              SIGNUP
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-light">
              CONTACT
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-light position-relative ms-3">
              <FaShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {cartItemsCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

