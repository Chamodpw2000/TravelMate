import React, { useContext } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import "./RestaurantDetails.css"; // Custom styles
import { ClientContext } from "../../context/ClientContext";

const RestaurantDetails = ({ id }) => {

  const { allRestaurants } = useContext(ClientContext);
  const { allRestaurantReviews } = useContext(ClientContext);
  const restaurant = allRestaurants.find((e) => e.id === parseInt(id));
  const restaurantReviews = allRestaurantReviews.filter((review) => review.restaurantId === restaurant.id);
  
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // Avoid division by zero
    const totalOverallRating = reviews.reduce((sum, review) => sum + review.overallRating, 0);
    const totalFoodRating = reviews.reduce((sum, review) => sum + review.foodRating, 0);
    const totalServiceRating = reviews.reduce((sum, review) => sum + review.serviceRating, 0);
    const totalValueRating = reviews.reduce((sum, review) => sum + review.valueRating, 0);
    const totalAtmosphereRating = reviews.reduce((sum, review) => sum + review.atmosphereRating, 0);
    const averageRatings = { "overall": parseFloat((totalOverallRating / reviews.length).toFixed(2)), "food": parseFloat((totalFoodRating / reviews.length).toFixed(2)), "service": parseFloat((totalServiceRating / reviews.length).toFixed(2)), "value": parseFloat((totalValueRating / reviews.length).toFixed(2)), "atmosphere": parseFloat((totalAtmosphereRating / reviews.length).toFixed(2)) };
    return averageRatings;
  };

  const averageRatings = calculateAverageRating(restaurantReviews);
  console.log("Average Rating:", averageRatings);

  const renderRatingDots = (rating) => {
    const maxDots = 5; // Maximum number of dots
    
    // Ensure `rating` is a valid number and within range
    if (typeof rating !== "number" || rating < 0 || rating > maxDots) {
      console.error("Invalid rating value:", rating);
      rating = 0; // Fallback to 0 for invalid ratings
    }
  
    const fullDots = Math.max(0, Math.min(Math.floor(rating), maxDots)); // Clamp fullDots
    const halfDot = rating % 1 !== 0 && fullDots < maxDots; // Check for halfDot
    const emptyDots = Math.max(0, maxDots - fullDots - (halfDot ? 1 : 0)); // Ensure non-negative emptyDots
  
    return (
      <div className="rating-dots d-flex justify-content-end align-items-center">
        {/* Full Dots */}
        {[...Array(fullDots)].map((_, index) => (
          <span key={`full-${index}`} className="rating-dot full"></span>
        ))}
        {/* Half Dot */}
        {halfDot && <span className="rating-dot half"></span>}
        {/* Empty Dots */}
        {[...Array(emptyDots)].map((_, index) => (
          <span key={`empty-${index}`} className="rating-dot empty"></span>
        ))}
      </div>
    );
  };
  
  

  return (
    <> {restaurant ? <>
    <Container className="my-4">
      <Row>
        <Col lg={4} md={12} className="mb-3 d-flex">
          <Card className="w-100 h-100">
            <Card.Body>
              <Card.Title>Ratings and Reviews</Card.Title>
              <h4>{averageRatings['overall']}</h4>
              <p>16,096 reviews</p>
              <p>#2 of 180 Restaurants in Ella</p>
              <p>Travelers' Choice Best of the Best 2024</p>
              <ListGroup className="ratings-list">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Food
                  {renderRatingDots(averageRatings['food'])}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Service
                  {renderRatingDots(averageRatings['service'])}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Value
                  {renderRatingDots(averageRatings['value'])}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Atmosphere
                  {renderRatingDots(5)}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12} className="mb-3 d-flex">
          <Card className="w-100 h-100">
            <Card.Body>
              <Card.Title>Details</Card.Title>
              <p>
                <strong>Price Range:</strong> $3.00 - $11.00
              </p>
              <p>
                <strong>Cuisines:</strong> International, Healthy, Sri Lankan
              </p>
              <p>
                <strong>Special Diets:</strong> Vegetarian Friendly, Vegan
                Options, Gluten Free
              </p>
              <a href="#">View all details</a>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12} className="mb-3 d-flex">
          <Card className="w-100 h-100">
            <Card.Body>
              <Card.Title>Location and Contact</Card.Title>
              <p>Wellawaya Road, Ella 90090, Sri Lanka</p>
              <p>
                <a href="#">Website</a> | <a href="#">Email</a>
              </p>
              <p>Phone: +94 77 180 4020</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </> : <></>}</>
    
  );
};

export default RestaurantDetails;
