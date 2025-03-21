import React, { useEffect, useState } from 'react';
// import Booking from './Booking';
import axios from 'axios';

import Swal from 'sweetalert2';
import VehicleBookingCard from './VehicalBookingCard';

const CancledVehicleBookings = () => {


    const [refreshBookings, setRefreshBookings] = useState(false);


  
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User is", user);

    useEffect(() => {
        
        if (user) {
            axios.get("http://localhost:3000/transportation/getcancelBooking", {
                params: { email: user.email }
            })
            .then((res) => {
                setBookings(res.data);
                console.log("Bookings are", res.data);
            })
            .catch((err) => {
                console.log("Error is", err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [refreshBookings]);

    return (
        <div className="container">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                    <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : bookings.length > 0 ? (
                <div>
                    {bookings.map((booking) => (
                       <VehicleBookingCard booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="card shadow-sm border-0 py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                        <div className="card-body">
                            <i className="fas fa-calendar-times text-primary mb-4" style={{ fontSize: '4rem' }}></i>
                            <h3 className="text-primary mb-3">No Available Bookings</h3>
                            <p className="text-muted">You don't have any current bookings at the moment.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancledVehicleBookings;
