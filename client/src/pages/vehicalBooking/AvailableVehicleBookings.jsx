import React, { useEffect, useState } from 'react';
// import Booking from './Booking';
import axios from 'axios';

import Swal from 'sweetalert2';
import VehicleBookingCard from './VehicalBookingCard';

const AvailableVehicleBookings = () => {


    const [refreshBookings, setRefreshBookings] = useState(false);


    const onMarkCancle = async (bookingId) => {
        const result = await Swal.fire({
            title: "Confirm Completion",
            text: "Are you sure you want to mark this booking as Cancled ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, mark as Cancled",
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put("http://localhost:3000/booking/cancleguidebooking", null, {
                    params: { id: bookingId },
                });

                if (response.data.success) {
                    Swal.fire({
                        title: "Success!",
                        text: "Guide booking has been marked as Cancled",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    setRefreshBookings(!refreshBookings);
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to mark guide booking as Cancle",
                    icon: "error",
                });
                console.log(error);
            }
        }
    };
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User is", user);

    useEffect(() => {
        
        if (user) {
            axios.get("http://localhost:3000/transportation/getBooking", {
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


    const handleCancelClick = async (booking) => {
        const result = await Swal.fire({
            title: 'Confirm Cancle',
            text: 'Are you sure you want to cancle this booking ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancle'
        });

        if (result.isConfirmed) {

            console.log("Booking",booking);
            console.log("booking v",booking.vehical);
            

            


            const bookingData ={

                bookingId: booking._id,
                tid : booking.vehical.tid,
                vid:booking.vehical.id

            }
            try {
                const response = await axios.put("http://localhost:3000/transportation/canclebooking", {
                    bookingData
                })




                if (response.data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Booking Cancled',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setRefreshBookings(!refreshBookings);
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to mark booking as completed',
                    icon: 'error'
                });
                console.log(error);
            }
        }
    };

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
                       <VehicleBookingCard booking={booking} handleCancelClick={handleCancelClick} />
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

export default AvailableVehicleBookings;
