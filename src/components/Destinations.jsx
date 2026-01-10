// 📁 src/components/Destinations.jsx
import React from 'react';
// import { Card, Button, Container, Row, Col } from 'react-bootstrap';

function Destinations() {
  const destinations = [
    {
      id: 1,
      title: "Santorini, Greece",
      image: "/images/destination1.jpg",
      description: "White buildings with blue domes overlooking the Aegean Sea.",
      price: "$1,299"
    },
    {
      id: 2,
      title: "Kyoto, Japan",
      image: "/images/destination2.jpg",
      description: "Ancient temples, traditional gardens, and cherry blossoms.",
      price: "$1,899"
    },
    {
      id: 3,
      title: "Banff, Canada",
      image: "/images/destination3.jpg",
      description: "Majestic mountains and crystal clear lakes in the Rockies.",
      price: "$1,599"
    }
  ];

  return (
    <div className="container my-5 py-5">
      <h2 className="text-center mb-5 display-4">Popular Destinations</h2>
      
      <div className='row'>
        {destinations.map((destination) => (
          <div key={destination.id} md={4} className="mb-4 col">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img 
                variant="top" 
                src={destination.image}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{destination.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {destination.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="h4 text-primary fw-bold">{destination.price}</span>
                  <Button variant="outline-primary">
                    <i className="bi bi-info-circle me-2"></i>
                    Details
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <small className="text-muted">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  4.8 • 234 reviews
                </small>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;