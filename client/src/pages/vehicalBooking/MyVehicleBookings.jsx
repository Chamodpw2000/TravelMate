import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const VehicleBookings = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    return (
        <div className="container-fluid py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
            <div className="container">
                {/* Welcome Header */}
                <div className="text-center mb-5">
                    <h1 className="display-4 text-primary fw-bold">
                        <i className="fas fa-calendar-check me-3"></i>
                        Welcome, {user.firstName}!
                    </h1>
                    <p className="lead text-muted">Here is Your Vehicle Bookings !</p>
                    <div className="w-25 mx-auto">
                        <hr className="text-primary" style={{ height: '3px', opacity: '0.5' }} />
                    </div>
                </div>

                {/* Navigation Cards */}
                <div className="row g-4 justify-content-center mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm hover-card" 
                             onClick={() => navigate("/myVehicleBooking/available")}
                             style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div className="card-body text-center p-4">
                                <i className="fas fa-calendar text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                                <h4 className="card-title">Available Bookings</h4>
                                <p className="card-text text-muted">View your current active bookings</p>
                                <button className="btn btn-outline-primary w-100">
                                    <i className="fas fa-arrow-right me-2"></i>View
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm hover-card" 
                             onClick={() => navigate("/myVehicleBooking/cancelled")}
                             style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div className="card-body text-center p-4">
                                <i className="fas fa-ban text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                                <h4 className="card-title">Cancelled Bookings</h4>
                                <p className="card-text text-muted">View your cancelled Bookings</p>
                                <button className="btn btn-outline-primary w-100">
                                    <i className="fas fa-arrow-right me-2"></i>View
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm hover-card" 
                             onClick={() => navigate("/myVehicleBooking/completed")}
                             style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div className="card-body text-center p-4">
                                <i className="fas fa-check-circle text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                                <h4 className="card-title">Completed Bookings</h4>
                                <p className="card-text text-muted">View your Completed</p>
                                <button className="btn btn-outline-primary w-100">
                                    <i className="fas fa-arrow-right me-2"></i>View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default VehicleBookings