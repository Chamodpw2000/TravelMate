import React from 'react'
import { FaChair, FaTruck, FaUserFriends } from 'react-icons/fa'


const VehicalCard = ({ vehicle, handleBooking, availableVehicals , availabilityChecked}) => {
    console.log("available Vehicals in card" , availableVehicals);
    
    return (
        <div className="col" key={vehicle.id}>
            <div className="card h-100 shadow-sm vehicle-card">
                {/* Vehicle Images Carousel */}
                {vehicle.images && vehicle.images.length > 0 ? (
                    <div id={`carousel-${vehicle.id}`} className="carousel slide" data-bs-ride="false">
                        <div className="carousel-inner">
                            {vehicle.images.map((image, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img
                                        src={image}
                                        className="d-block w-100"
                                        alt={`${vehicle.brand} ${vehicle.model} - View ${index + 1}`}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {vehicle.images.length > 1 && (
                            <>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${vehicle.id}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${vehicle.id}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="vehicle-placeholder d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                        <FaTruck className="fs-1 text-secondary" />
                    </div>
                )}

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title">{vehicle.brand} {vehicle.model}</h4>
                        <span className="badge bg-info">{vehicle.year}</span>
                    </div>

                    <div className="row mb-3 text-center g-2">
                        <div className="col-4">
                            <div className="border rounded p-2">
                                <small className="d-block text-muted">Capacity</small>
                                <div className="d-flex align-items-center justify-content-center">
                                    <FaUserFriends className="me-1" />
                                    <strong>{vehicle.capacity}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border rounded p-2">
                                <small className="d-block text-muted">Seats</small>
                                <div className="d-flex align-items-center justify-content-center">
                                    <FaChair className="me-1" />
                                    <strong>{vehicle.seates}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border rounded p-2">
                                <small className="d-block text-muted">Grade</small>
                                <strong>{vehicle.grade}</strong>
                            </div>
                        </div>
                    </div>

                    <p className="card-text">{vehicle.description}</p>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center bg-white">
                    <div>
                        <span className="fs-5 fw-bold text-primary">${vehicle.price}</span>
                        <span className="text-muted ms-1">/ hour</span>
                    </div>



                    
{availabilityChecked ? (
    console.log("available Vehicals in card in rendering" , availableVehicals),
    console.log("vehicle id in rendaring" , vehicle.id),

    
    
    
    availableVehicals?.includes(vehicle.id) ? (
    
        
        <button className="btn btn-primary" onClick={() => handleBooking(vehicle)}>
            Book Now
        </button>
    ) : (
        <button className="btn btn-secondary" disabled>
            Not Available
        </button>
    )
) : (
    <p>Please Check availability Before Book a vehical</p>
)}
                        









                </div>
            </div>
        </div>
    )
}

export default VehicalCard