import React, { useState, useEffect } from "react";
import { InputGroup, Form, Col, Row, Container, Button } from "react-bootstrap";
import Select from "react-select";
import AdminLogo from "../../assets/TravelMateAdminLogo.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ViewTransportationService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transportationServiceDetails, setTransportationServiceDetails] = useState({
    transportationServiceName: "",
    availableVehicles: [],
    pricePerHour: "",
    address: "",
    contactNumber: "",
    description: "",
  });

  useEffect(() => {
    const fetchTransportationService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/travelmate/viewTransportationService/${id}`
        );
        if (response.data.success) {
          setTransportationServiceDetails(response.data.data);
        } else {
          alert(response.data.message || "Failed to fetch transportation service details.");
        }
      } catch (error) {
        console.error("Error fetching transportation service details:", error);
      }
    };

    fetchTransportationService();
  }, [id]);

  const availableVehicleOptions = [
    { value: "Cars", label: "Cars" },
    { value: "Buses", label: "Buses" },
    { value: "Motorcycles", label: "Motorcycles" },
    { value: "Bicycles", label: "Bicycles" },
    { value: "Other", label: "Other" },
  ];

  const handleMultiSelectChange = (selectedOptions, action) => {
    setTransportationServiceDetails({
      ...transportationServiceDetails,
      [action.name]: selectedOptions.map((option) => option.value),
    });
  };

  const changeHandler = (e) => {
    setTransportationServiceDetails({
      ...transportationServiceDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/travelmate/updateTransportationService/${id}`,
        transportationServiceDetails
      );

      if (response.data.success) {
        alert("Transportation service updated successfully!");
        navigate("/transport-mode-data-table");
      } else {
        alert(response.data.message || "Failed to update transportation service.");
      }
    } catch (error) {
      console.error("Error updating transportation service:", error);
    }
  };

  return (
    <div className="ViewTransportationService">
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
              <div className="d-flex justify-content-left align-items-left">
                <img
                  src={AdminLogo}
                  alt="Icon"
                  style={{ height: "98px", paddingBottom: "33px" }}
                />
              </div>
              <h2 className="fw-bold" style={{ paddingBottom: "25px" }}>
                Update Transportation Service
              </h2>

              <Container style={{ maxWidth: "100%" }}>
                <Form>
                  <Row>
                    <Col md="6">
                      <Form.Group
                        controlId="formTransportationServiceName"
                        className="mb-3"
                      >
                        <Form.Label>Transportation Service Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter the transportation service"
                          name="transportationServiceName"
                          value={transportationServiceDetails.transportationServiceName}
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
                      <Form.Group
                        controlId="formAvailableVehicles"
                        className="mb-3"
                      >
                        <Form.Label>Available Vehicles</Form.Label>
                        <Select
                          isMulti
                          name="availableVehicles"
                          options={availableVehicleOptions}
                          value={availableVehicleOptions.filter((option) =>
                            transportationServiceDetails.availableVehicles?.includes(
                              option.value
                            )
                          )}
                          onChange={handleMultiSelectChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <Form.Group controlId="formAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Enter the address"
                          name="address"
                          value={transportationServiceDetails.address}
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

                    <Col md="6">
                      <Form.Group
                        controlId="formContactNumber"
                        className="mb-3"
                      >
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter the contact number"
                          maxLength="10"
                          name="contactNumber"
                          value={transportationServiceDetails.contactNumber}
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
                      <Form.Group controlId="formPricePerHour" className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            placeholder="Enter Price per Hour"
                            name="pricePerHour"
                            value={transportationServiceDetails.pricePerHour}
                            onChange={changeHandler}
                            style={{
                              borderRadius: "10px 0 0 10px",
                              height: "50px",
                              borderWidth: "2px",
                            }}
                          />
                          <InputGroup.Text
                            style={{
                              borderRadius: "0 10px 10px 0",
                              height: "50px",
                              borderWidth: "2px",
                            }}
                          >
                            $ per hour
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={10}
                          placeholder="Enter a brief description"
                          name="description"
                          value={transportationServiceDetails.description}
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
                    Update Transportation Service
                  </Button>
                  <Button className="mx-3" variant="primary" onClick={()=>navigate("/manage-vehicals/"+id)}>

                    Manage Vehicals
                  </Button>
                </Form>
              </Container>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ViewTransportationService;
