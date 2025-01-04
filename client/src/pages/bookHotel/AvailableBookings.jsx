import React, { useEffect, useState } from 'react';
import Booking from './Booking';
import axios from 'axios';

const AvailableBookings = () => {
    const [bookings, setBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            axios.get("http://localhost:3000/booking/getbookings", {
                params: { email: user.email }
            })
            .then((res) => {
                setBookings(res.data);
                console.log("Bookings are", res.data);
            })
            .catch((err) => {
                console.log("Error is", err);
            });
        }
    }, []);

    return (
        <div className='container'>
            {bookings.length > 0 ? (
                <div>
                    {bookings.map((booking) => (
                        <Booking
                            key={booking._id}
                            roomName={booking.room.name}
                            accName={booking.accommodation.name}
                            roomCount={booking.roomcount}
                            price={booking.totalprice}
                            toDate={booking.to}
                            fromDate={booking.from}
                            daysCount={booking.totaldays}
                            id={booking._id}
                            status={booking.status}
                        />
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

export default AvailableBookings;
