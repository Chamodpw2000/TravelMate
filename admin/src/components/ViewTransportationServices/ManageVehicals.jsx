import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ManageVehicals
 = () => {

    const handleEdit = (vehical) => {

        setSelectedVehical(vehical);
        setEditedVehical(vehical);
        setShowModal(true);
        setInitialImages(vehical.images);
        setSelectedImages(vehical.images);
        document.body.classList.add('modal-open');
        console.log("Selected Images", selectedImages);
        console.log("Selected Images", vehical.images);

        
    };
    const [editedVehical, setEditedVehical] = useState({});
    
    const navigate = useNavigate(); 
    const [showModal, setShowModal] = useState(false);
    const [selectedVehical, setSelectedVehical] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [initialImages, setInitialImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...newImageUrls]);
        setEditedVehical(prev => ({
            ...prev,
            imagesToUpload: [...(prev.imagesToUpload || []), ...files]
        }));
    };

    const deleteImagesFromCloudinary = async (publicIds) => {
        const deletedResults = [];
        for (const publicId of publicIds) {
            const timestamp = Math.round(new Date().getTime() / 1000);
            const apiKey = "798218248754595";
            const apiSecret = "8q9WAeXqTlrZkl0wVDJsn6BLAts";
            const signature = generateSignature(publicId, apiSecret, timestamp);

            const formData = new FormData();
            formData.append("public_id", publicId);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);

            try {
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dqbkxghlh/image/destroy",
                    formData
                );

                if (response.status === 200) {
                    deletedResults.push({
                        publicId,
                        status: "deleted"
                    });
                }
            } catch (error) {
                deletedResults.push({
                    publicId,
                    status: "failed",
                    error: error.message
                });
            }
        }
        return deletedResults;
    };

    const deleteImagesFromMongo = async (images) => {
        try {
            await axios.delete("http://localhost:3000/hotels/deleteroomimage", {
                data: { images }
            });
        } catch (error) {
            throw new Error('Failed to delete images from MongoDB');
        }
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            let publicIdsToDelete = imagesToRemove.map(url => getPublicIdFromUrl(url));
            await deleteImagesFromCloudinary(publicIdsToDelete);

            const deleteImages = {
                imagesToRemove,
                ts: transportationServiceDetails._id,
                vehical: selectedVehical.id
            };
            await deleteImagesFromMongo(deleteImages);

            let tempuploadedImages = [];
            if (editedVehical.imagesToUpload?.length) {
                tempuploadedImages = await uploadImagesToCloudinary(editedVehical.imagesToUpload);
            }

            const uploadedImages = [...initialImages, ...tempuploadedImages];
            editedVehical.images = uploadedImages;

            const response = await axios.put('http://localhost:3000/hotels/editroom', editedVehical);

            if (response.status === 200 || response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Vehical updated successfully',
                    confirmButtonColor: '#3085d6'
                });
                navigate("/");
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update room details',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsUpdating(false);
            handleClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedVehical(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleClose = () => {
        setShowModal(false);
        setSelectedVehical(null);
        document.body.classList.remove('modal-open');
    };

    const [transportationServiceDetails, setTransportationServiceDetails] = useState({
        transportationServiceName: "",
        availableVehicles: [],
        pricePerHour: "",
        address: "",
        contactNumber: "",
        description: "",
      });
    

    const {id} = useParams()
    useEffect(() => {
        const fetchTransportationService = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/travelmate/viewTransportationService/${id}`
            );
            if (response.data.success) {
                console.log("Data",response.data.data);
                
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
  return (
    <div className="container mt-5">
    <div className="card shadow-lg " style={{marginTop: '100px'}}>
        <div className="card-header bg-primary text-white">
            <h2 className="mb-0">{transportationServiceDetails?.transportationServiceName} - Vehical Management</h2>
        </div>

        <div className="card-body">
            {transportationServiceDetails?.availableVehicles?.length > 0 ? (
                <div className="row">
                    {transportationServiceDetails.availableVehicles.map((vehical) => (
                        <div key={vehical.id} className="col-md-6 mb-4">
                            <div className="card h-100 border-primary">
                                <div className="card-header bg-light">
                                    <h4 className="text-primary mb-0">{vehical?.brand} - {vehical?.model}</h4>
                                </div>
                                <div className="card-body">
                                    <div className="room-details">
                                        <p><strong>Price:</strong> ${vehical?.price}/day</p>
                                        <p><strong>Engine Capacity:</strong> {vehical?.capacity}</p>
                                        <p><strong>Year:</strong> {vehical?.year}</p>
                                        <p><strong>Seates: </strong> {vehical?.seates}</p>
                                        <p><strong>Grade:</strong> {vehical?.grade}</p>
                                        <p><strong>Description:</strong> {vehical?.description}</p>
                                        
                                        <div className="image-gallery mb-3">
                                            <div className="d-flex flex-wrap gap-2">
                                                {vehical.images?.map((image, index) => (
                                                    <img 
                                                        key={index}
                                                        src={image}
                                                        alt={`Room ${index + 1}`}
                                                        className="img-thumbnail"
                                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-primary w-100"
                                        onClick={() => handleEdit(vehical)}
                                    >
                                        Edit Vehical
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center my-5">
                    <h4 className="text-muted">No vehicals available</h4>
                </div>
            )}
            
            <button 
                className="btn btn-success w-100 mt-3"
                onClick={() => navigate("/add-vehical", { state: transportationServiceDetails.id })}
            >
                Add New Vehical
            </button>
        </div>
    </div>

    {/* Edit Vehical Modal */}
     <div className={`modal fade ${showModal ? 'show' : ''}`} 
         style={{ display: showModal ? 'block' : 'none' }}
         tabIndex="-1">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Room Details</h5>
                    <button type="button" 
                            className="btn-close" 
                            onClick={handleClose}>
                    </button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Room Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={editedVehical.name || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Price per Night</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={editedVehical.price || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Capacity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="capacity"
                                value={editedVehical.capacity || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Total Rooms</label>
                            <input
                                type="number"
                                className="form-control"
                                name="total"
                                value={editedVehical.total || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Grade</label>
                            <select 
                                className="form-select"
                                name="grade"
                                value={editedVehical.grade || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Grade</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={editedVehical.description || ""}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Vehical Images</label>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {selectedImages?.map((image, index) => (
                                    <div key={index} className="position-relative">
                                        <img
                                            src={image}
                                            alt={`Room ${index + 1}`}
                                            className="img-thumbnail"
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-close position-absolute top-0 end-0 bg-danger"
                                            onClick={() => handleRemoveImage(index)}
                                            style={{ margin: "2px" }}
                                        ></button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleClose}
                        disabled={isUpdating}>
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleSave}
                        disabled={isUpdating}>
                        {isUpdating ? (
                            <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    </div> 
     {showModal && <div className="modal-backdrop fade show"></div>} 
</div>
  )
}

export default ManageVehicals
