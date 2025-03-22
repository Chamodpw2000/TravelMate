import React from 'react';
import './vehiclecard.css';

const BookingCard = ({ booking , handleCancelClick}) => {
    const { vehical, fromDate, toDate, totaldays, totalprice, status, date, _id } = booking;

    // Format the booking date and time
    const bookingDateTime = new Date(date);
    const formattedBookingDate = bookingDateTime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedBookingTime = bookingDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Function to handle cancel button click
   

    // Only show cancel button if status is not already "Cancelled"
    const showCancelButton = status.toLowerCase() === 'booked';

    return (
        <div className="booking-card">
            <div className="booking-card-header">
                <div className="booking-status" data-status={status.toLowerCase()}>
                    {status}
                </div>
                <div className="booking-info">
                    <div className="booking-dates">
                        <span className="date-label">Rental Period:</span>
                        <span className="date-value">{fromDate}</span> to <span className="date-value">{toDate}</span>
                    </div>
                    <div className="booking-created">
                        <span className="created-label">Booked on:</span>
                        <span className="created-value">{formattedBookingDate} at {formattedBookingTime}</span>
                    </div>
                </div>
            </div>

            <div className="booking-card-body">
                <div className="vehicle-image">
                    <img src={vehical.images[0]} alt={`${vehical.brand} ${vehical.model}`} />
                </div>

                <div className="vehicle-details">
                    <h3>{vehical.brand} {vehical.model} ({vehical.year})</h3>
                    <div className="vehicle-specs">
                        <span>Grade {vehical.grade}</span>
                        <span>{vehical.capacity}cc</span>
                        <span>{vehical.seates} Seats</span>
                    </div>
                    <p className="vehicle-description">{vehical.description.substring(0, 550)}...</p>
                    <p className='vehicle-description my-3'>
                        Booking id - {booking._id}
                    </p>
                </div>
            </div>

            <div className="booking-card-footer">
                <div className="booking-duration">
                    <span className="duration-label">Duration:</span>
                    <span className="duration-value">{totaldays} days</span>
                </div>
                <div className="booking-price">
                    <span className="price-label">Total:</span>
                    <span className="price-value">${totalprice.toLocaleString()}</span>
                </div>
                {showCancelButton && (
                    <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancelClick(booking)}
                    >
                        Cancel Booking
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
