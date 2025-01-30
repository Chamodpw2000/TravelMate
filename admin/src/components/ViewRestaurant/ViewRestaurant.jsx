import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLogo from "../../assets/TravelMateAdminLogo.png";
import Select from "react-select";
import {
  InputGroup,
  Form,
  Col,
  Row,
  Container,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    category: [],
    mainCategory: "",
    address: "",
    contactNumber: "",
    email: "",
    website: "",
    openingHours: [{ startTime: "", endTime: "" }],
    priceRange: [],
    description: "",
  });

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/travelmate/viewRestaurant/${id}`
        );
        if (response.data.success) {
          setRestaurantDetails(response.data.data);
        } else {
          alert(response.data.message || "Failed to fetch restaurant details.");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const categoryOptions = [
    { value: "Seafood", label: "Seafood" },
    { value: "Spicy", label: "Spicy" },
    { value: "vegetarian and vegan ", label: "vegetarian and vegan " },
    { value: "Village Flavor", label: "Village Flavor" },
    { value: "Sweet", label: "Sweet" },
    { value: "Street Food", label: "Street Food" },
    { value: "tea culture ", label: "tea culture " },
  ];

  const priceRangeOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const mainCategoryOptions = [
    { value: "DateNight", label: "DateNight" },
    { value: "Fine Dining", label: "Fine Dining" },
    { value: "Vegan & Veg", label: "Vegan & Veg" },
    { value: "Casual Dining", label: "Casual Dining" },
    { value: "Outside", label: "Outside" },
  ];

  const handleMultiSelectChange = (selectedOptions, action) => {
    setRestaurantDetails({
      ...restaurantDetails,
      [action.name]: selectedOptions.map((option) => option.value),
    });
  };

  const changeHandler = (e) => {
    setRestaurantDetails({
      ...restaurantDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (e, index, timeType) => {
    const updatedOpeningHours = [...restaurantDetails.openingHours];
    updatedOpeningHours[index][timeType] = e.target.value;
    setRestaurantDetails({
      ...restaurantDetails,
      openingHours: updatedOpeningHours,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/travelmate/updateRestaurant/${id}`,
        restaurantDetails
      );

      if (response.data.success) {
        alert("Restaurant updated successfully!");
        navigate("/restaurants");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  return (
    <div className="UpdateRestaurant" style={{ marginTop: '200px' }}>
      <header>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "100%" }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "1200px",
                width: "100%",
              }}
            >
              <h2 className="fw-bold" style={{ paddingBottom: "25px" }}>
                Update Restaurant
              </h2>

              <Container style={{ maxWidth: "100%" }}>
                <Form>
                  <Row>
                    <Col md="6">
                      <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Restaurant Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter the restaurant name"
                          name="name"
                          value={restaurantDetails.name}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            height: "50px",
                            borderWidth: "2px",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group controlId="formWebsite" className="mb-3">
                        <Form.Label>Website url</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter website url"
                          name="website"
                          value={restaurantDetails.website}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            height: "50px",
                            borderWidth: "2px",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {restaurantDetails.openingHours.map((day, index) => (
                      <Col md="6" key={index} className="mb-3">
                        <Form.Group controlId={`formOpeningHours-${index}`}>
                          <Form.Label>Opening hours</Form.Label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Opening time</Tooltip>}
                            >
                              <Form.Control
                                type="time"
                                name="startTime"
                                value={day.startTime}
                                onChange={(e) =>
                                  handleTimeChange(e, index, "startTime")
                                }
                              />
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Closing time</Tooltip>}
                            >
                              <Form.Control
                                type="time"
                                name="endTime"
                                value={day.endTime}
                                onChange={(e) =>
                                  handleTimeChange(e, index, "endTime")
                                }
                              />
                            </OverlayTrigger>
                          </div>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <Row>
                    <Col md="6">
                      <Form.Group controlId="formCategory" className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Select
                          isMulti
                          name="category"
                          options={categoryOptions}
                          value={categoryOptions.filter((option) =>
                            restaurantDetails.category.includes(option.value)
                          )}
                          onChange={handleMultiSelectChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group controlId="formPriceRange" className="mb-3">
                        <Form.Label>Price Range</Form.Label>
                        <Select
                          isMulti
                          name="priceRange"
                          options={priceRangeOptions}
                          value={priceRangeOptions.filter((option) =>
                            restaurantDetails.priceRange.includes(option.value)
                          )}
                          onChange={handleMultiSelectChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group controlId="formMainCategory" className="mb-3">
                        <Form.Label>Main Category</Form.Label>
                        <Select
                          name="mainCategory"
                          options={mainCategoryOptions}
                          value={mainCategoryOptions.find(
                            (option) =>
                              option.value === restaurantDetails.mainCategory
                          )}
                          onChange={(selectedOption) =>
                            setRestaurantDetails({
                              ...restaurantDetails,
                              mainCategory: selectedOption.value,
                            })
                          }
                          isClearable
                        />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group controlId="formContactNumber" className="mb-3">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter the contact number"
                          maxLength="10"
                          name="contactNumber"
                          value={restaurantDetails.contactNumber}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            height: "50px",
                            borderWidth: "2px",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group controlId="email" className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter email address"
                          name="email"
                          value={restaurantDetails.email}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            height: "50px",
                            borderWidth: "2px",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Form.Group controlId="formAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Enter address"
                          name="address"
                          value={restaurantDetails.address}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            borderWidth: "2px",
                            resize: "none",
                            height: "100px",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md="12">
                      <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={10}
                          placeholder="Enter a brief description about the restaurant"
                          name="description"
                          value={restaurantDetails.description}
                          onChange={changeHandler}
                          style={{
                            borderRadius: "10px",
                            borderWidth: "2px",
                            resize: "none",
                            height: "100px",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" onClick={handleSubmit}>
                    Update Restaurant
                  </Button>
                </Form>
              </Container>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default UpdateRestaurant;
