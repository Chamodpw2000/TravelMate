import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/TravalMateLogo2.png';

const TransportationCard = ({ service = {} }) => {
  const {
    id = "",
    images = [],
    transportationServiceName = "N/A",
    description = "No description available",
    rating = null,
    pricePerHour = null,
  } = service;

  return (
    <Link to={id ? `/transportation/${id}` : "#"} style={{ textDecoration: 'none' }}>
      <Card style={{ width: '22rem' }} className="shadow-sm border-primary">
        {images.length > 0 ? (
          <div style={{ width: '100%', height: '180px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card.Img variant="top" src={images[0]} alt={transportationServiceName} style={{ objectFit: 'cover', width: '100%', height: '180px' }} />
          </div>
        ) : (
          <div className="bg-secondary text-white text-center" style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No Image Available
          </div>
        )}
        <Card.Body>
          <Card.Title className="text-primary">{transportationServiceName}</Card.Title>
          <Card.Text className="text-muted">{description}</Card.Text>
          <Row className="align-items-center mt-3">
            <Col xs={6} className="text-start">
              <span className="text-muted">{rating !== null ? `${rating} ⭐` : "No rating available"}</span>
            </Col>
            <Col xs={6} className="text-end" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {pricePerHour !== null ? `From ${pricePerHour} LKR per hour` : "Price not available"}
            </Col>
          </Row>
          <Button
            variant="info"
            className="mt-4 mb-3"
            style={{
              backgroundColor: '#C1EAF8',
              border: 'none',
              color: '#007bff',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '30px',
              padding: '10px 0',
              width: '230px',
              height: '46px',
              margin: '0 auto',
            }}
          >
            Discover More
            <img
              src={logo}
              alt="logo"
              style={{ marginLeft: '10px', width: '25px', height: '25px' }}
            />
          </Button>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default TransportationCard;
