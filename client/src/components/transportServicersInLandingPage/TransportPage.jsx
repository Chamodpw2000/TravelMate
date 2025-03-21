import React, { useContext, useState, useEffect, useMemo } from 'react';
import { ClientContext } from '../../context/ClientContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaTruck, FaUserFriends, FaChair, FaStar } from 'react-icons/fa';
import { DatePicker, Spin, notification } from 'antd';
import moment from 'moment';

import "./transport.css"
import VehicalCard from './VehicalCard';
import Swal from 'sweetalert2';
import axios from 'axios';

const { RangePicker } = DatePicker;

const TransportPage = () => {
    const { allTransportServices, loading } = useContext(ClientContext);
    const [availabilityChecked, setAvailabilityChecked] = useState(false);
    const { transportationID } = useParams();
    const navigate = useNavigate();
    const [availableVehicals, setAvailableVehicals] = useState([]);

    const [bookedVehicles, setBookedVehicles] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [availabilityMessage, setAvailabilityMessage] = useState({ text: "", isAvailable: null });
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Find the transportation service using useMemo to avoid unnecessary recalculations
    const transportationService = useMemo(() => {
        const id = parseInt(transportationID);
        return allTransportServices?.find(service => service.id === id) || null;
    }, [allTransportServices, transportationID]);

    // Check if the service exists when component mounts or when transportationService changes


    // Handle booking a vehicle
    const handleBooking = (vehical) => {
        setIsCheckingAvailability(true);

        console.log(
            vehical
        );

        Swal.fire({

            title: 'Are you sure?',
            text: `You are about to book ${vehical.brand} ${vehical.model} for the selected dates ${fromDate} to ${toDate}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Book it!',
            cancelButtonText: 'No, Cancel!',
            confirmButtonColor: '#1890ff',
            cancelButtonColor: '#ff4d4f',
        }).then((result) => {
            if (result.isConfirmed) {
                // Add the booking to the vehicle
              const user = JSON.parse(localStorage.getItem('user'));
              const newBooking ={
                fromDate: fromDate,
                toDate: toDate,
                user:user,
                vehicle:vehical,
                totaldays: moment.duration(moment(toDate, "DD-MM-YYYY").diff(moment(fromDate, "DD-MM-YYYY"))).asDays() + 1,
                totalprice: vehical?.price * (moment.duration(moment(toDate, "DD-MM-YYYY").diff(moment(fromDate, "DD-MM-YYYY"))).asDays() + 1),
              }
              axios.post('http://localhost:3000/transportation/addBooking',newBooking).then((res)=>{
                Swal.fire('Booked!', 'Your vehicle has been booked successfully.', 'success');
              }).catch((err)=>{
                Swal.fire('Failed!', 'Something went wrong', 'error');
                console.log(err);
                
              })
            }
        });
    };



    const checkAvailability = (newFromDate, newToDate, existingBookings) => {
        console.log(newFromDate, newToDate, existingBookings);

        // Convert input dates to moment objects for better comparison
        const checkStart = moment(newFromDate, "DD-MM-YYYY");
        const checkEnd = moment(newToDate, "DD-MM-YYYY");

        for (const booking of existingBookings) {
            const existingStart = moment(booking.fromDate, "DD-MM-YYYY");
            const existingEnd = moment(booking.toDate, "DD-MM-YYYY");

            // All possible overlap scenarios:
            const isOverlapping = (
                // New booking starts during existing booking
                (checkStart.isSameOrAfter(existingStart) && checkStart.isSameOrBefore(existingEnd)) ||
                // New booking ends during existing booking
                (checkEnd.isSameOrAfter(existingStart) && checkEnd.isSameOrBefore(existingEnd)) ||
                // New booking contains existing booking
                (checkStart.isSameOrBefore(existingStart) && checkEnd.isSameOrAfter(existingEnd)) ||
                // Existing booking contains new booking
                (existingStart.isSameOrBefore(checkStart) && existingEnd.isSameOrAfter(checkEnd)) ||
                // Same day bookings
                checkStart.isSame(existingStart) || checkEnd.isSame(existingEnd)
            );

            if (isOverlapping) {
                return false;
            }
        }
        return true;
    };

    // Check availability of vehicles
    const handleAvailabilityCheck = () => {
        if (!fromDate || !toDate) {
            notification.warning({
                message: 'Date Selection Required',
                description: 'Please select a date range to check availability.',
                duration: 3,
            });
            return;
        }

        const availabe = [];


        transportationService.availableVehicles.forEach((vehicle) => {
            console.log("id", vehicle.id);
            console.log("Bookings", vehicle.bookings);



            const isAvailable = checkAvailability(fromDate, toDate, vehicle.bookings);
            console.log("isAvailable", isAvailable);
            if (isAvailable) {
                console.log("vehicle is available", vehicle.id);

                availabe.push(vehicle.id);
            }

        });

        console.log("availabe", availabe);



        setAvailableVehicals(availabe);
        console.log("availabe vehicals", availableVehicals);
        setAvailabilityChecked(true);
        setAvailabilityMessage({ text: `Therse Vehicles are available for the selected dates ${fromDate} to ${toDate}  `, isAvailable: true });
    };

    // Handle date range selection
    const handleDateRangeChange = (dates) => {
        if (!dates || dates.length !== 2) {
            setFromDate(null);
            setToDate(null);
            setDateRange([null, null]);
            setAvailabilityMessage({ text: "", isAvailable: null });
            return;
        }

        const [start, end] = dates;
        setDateRange([start, end]);
        setFromDate(start.format("DD-MM-YYYY"));
        setToDate(end.format("DD-MM-YYYY"));
        setAvailabilityMessage({ text: "", isAvailable: null });
    };

    // Render rating stars
    const renderRatingStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`me-1 ${i < rating ? "text-warning" : "text-secondary"}`}
                aria-hidden="true"
            />
        ));
    };

    // Loading state
    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spin size="large" tip="Loading transportation service..." />
            </div>
        );
    }

    // Error state - service not found
    if (!transportationService) {
        return (
            <div className="container my-5 text-center">
                <div className="alert alert-warning">
                    <h3>Transportation service not found</h3>
                    <p>The service you're looking for doesn't exist or has been removed.</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/transportation')}
                    >
                        View All Transportation Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Service Header with Availability Check */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="row justify-content-between">
                        {/* Service Details - Left Side */}
                        <div className="col-md-7">
                            <h1 className="display-5 fw-bold text-primary mb-3">
                                {transportationService.transportationServiceName}
                            </h1>
                            <p className="lead mb-4">{transportationService.description}</p>
                            <div className="d-flex mb-3 align-items-center">
                                <div className="me-3" aria-label={`Rating: ${transportationService.rating} out of 5`}>
                                    {renderRatingStars(transportationService.rating)}
                                </div>
                                <span className="text-muted">({transportationService.rating}/5)</span>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="text-muted">PRICE PER DAY</h6>
                                    <p className="fs-5 fw-bold">${transportationService.pricePerHour} Upwards</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">ADDRESS</h6>
                                    <p>{transportationService.address}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">CONTACT</h6>
                                    <p>{transportationService.contactNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Empty column to create space */}


                        {/* Availability Check - Right Side */}
                        <div className="col-md-4">
                            <div className="availability-check-container p-3 bg-light rounded">
                                <h4 className="mb-3">
                                    <FaCalendarAlt className="me-2 text-primary" />
                                    Check Availability
                                </h4>
                                <RangePicker
                                    format={"DD-MM-YYYY"}
                                    onChange={handleDateRangeChange}
                                    value={dateRange}
                                    className="w-100 mb-3"
                                    disabledDate={(current) => current && current < moment().startOf('day')}
                                    placeholder={['Start Date', 'End Date']}
                                />
                                {(!fromDate || !toDate) ? (
                                    <div className="alert alert-warning">
                                        Please select dates to proceed
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleAvailabilityCheck}
                                            className="btn btn-primary w-100 py-2"
                                            disabled={isCheckingAvailability}
                                        >
                                            {isCheckingAvailability ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Checking...
                                                </>
                                            ) : (
                                                'Check Availability'
                                            )}
                                        </button>
                                        {availabilityMessage.isAvailable !== null && (
                                            <div className={`mt-2 text-center ${availabilityMessage.isAvailable ? "text-success" : "text-danger"}`}>
                                                {availabilityMessage.text}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="col-md-1 d-none d-md-block">


                                <img
                                    src={transportationService.images[0]}
                                    alt="Transportation Service"
                                    className='rounded shadow-sm mt-3 mb-3 mx-4 '
                                    style={{ height: "200px", objectFit: "cover", borderRadius: "40px" }}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Vehicles Section */}
            <section aria-labelledby="available-vehicles-heading">
                <h2 id="available-vehicles-heading" className="mb-4 border-bottom pb-2">Available Vehicles</h2>

                {transportationService.availableVehicles?.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                        {transportationService.availableVehicles.map((vehicle) => (
                            <VehicalCard vehicle={vehicle} handleBooking={handleBooking} availableVehicals={availableVehicals} availabilityChecked={availabilityChecked} />
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        No vehicles are currently available for this service. Please check back later or try different dates.
                    </div>
                )}
            </section>

            {/* Features Section */}


            {/* Customer Reviews Section */}
            {transportationService.reviews && transportationService.reviews.length > 0 && (
                <section className="mb-5">
                    <h2 className="mb-4 border-bottom pb-2">Customer Reviews</h2>
                    <div className="row g-4">
                        {transportationService.reviews.slice(0, 3).map((review, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex mb-3">
                                            {renderRatingStars(review.rating)}
                                        </div>
                                        <p className="card-text">{review.comment}</p>
                                        <div className="d-flex align-items-center mt-3">
                                            <div className="avatar bg-light rounded-circle p-2 me-3">
                                                <i className="bi bi-person-circle fs-4"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{review.name}</h6>
                                                <small className="text-muted">{review.date}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {transportationService.reviews.length > 3 && (
                        <div className="text-center mt-4">
                            <button className="btn btn-outline-primary">View All Reviews</button>
                        </div>
                    )}
                </section>
            )}

            {/* FAQ Section */}
            <section className="mb-5">
                <h2 className="mb-4 border-bottom pb-2">Frequently Asked Questions</h2>
                <div className="accordion" id="transportFAQ">
                    <div className="accordion-item">
                        <h3 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                How do I book a vehicle?
                            </button>
                        </h3>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#transportFAQ">
                            <div className="accordion-body">
                                To book a vehicle, select your desired dates using the date picker, check availability, and then click the "Book Now" button on the vehicle you want to reserve.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h3 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                What is your cancellation policy?
                            </button>
                        </h3>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#transportFAQ">
                            <div className="accordion-body">
                                Cancellations made 48 hours or more before the scheduled pickup time receive a full refund. Cancellations within 48 hours may be subject to a cancellation fee.
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h3 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Do you provide drivers with the vehicles?
                            </button>
                        </h3>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#transportFAQ">
                            <div className="accordion-body">
                                Yes, all our vehicles come with professional, licensed drivers who are familiar with the local area and routes.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <div className="card bg-primary text-white mb-5">
                <div className="card-body p-4 p-md-5">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="fw-bold mb-3">Need a custom transportation solution?</h2>
                            <p className="lead mb-md-0">Contact our team for personalized service and special group rates.</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button className="btn btn-light btn-lg px-4">
                                <i className="bi bi-telephone me-2"></i>
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportPage;
