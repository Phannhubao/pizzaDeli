import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ProductList.css';
import Swal from 'sweetalert2';
import ProductCard from './ProductCard';

const FlightList = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        
        const response = await fetch('http://localhost:8080/api/Flight/GetFlightList', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }

        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          // Map flight data to match ProductCard props
          const mappedFlights = data.data.map(flight => ({
            id: flight.flightId,
            name: `${flight.departureAirport} to ${flight.arrivalAirport}`,
            price: flight.price,
            tag: flight.seatClass,
            description: `Departure: ${new Date(flight.departureTime).toLocaleString()} | Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`,
            image: '/img/flight-placeholder.jpg', // Replace with actual image URL or logic
            details: `Flight ${flight.flightId} | ${flight.seatClass} Class | ${flight.totalSeats} Seats Available`
          }));
          setFlights(mappedFlights);
        } else {
          throw new Error(data.message || 'Invalid response format');
        }
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh sách chuyến bay: ' + err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleAddToCart = (flightId, e) => {
    e.stopPropagation();
    const flightToAdd = flights.find(f => f.id === flightId);

    if (flightToAdd) {
      setCart([...cart, flightToAdd]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Đã thêm vào danh sách đặt vé',
        text: `${flightToAdd.name} đã được thêm vào danh sách đặt vé`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8f9fa',
        iconColor: '#28a745'
      });
      console.log(`Added flight ${flightId} to cart`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tìm thấy chuyến bay',
      });
    }
  };

  if (loading) {
    return (
      <div className="container product-list-container">
        <h1 className="section-title">Đang tải danh sách chuyến bay...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container product-list-container">
        <h1 className="section-title">Lỗi: {error}</h1>
      </div>
    );
  }

  return (
    <div className="container product-list-container">
      <h1 className="section-title">Danh Sách Chuyến Bay</h1>
      <div className="row">
        {flights.map((flight) => (
          <ProductCard
            key={flight.id}
            product={flight}
            onAddToCart={handleAddToCart}
            onClick={() => navigate(`/flight/${flight.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightList;