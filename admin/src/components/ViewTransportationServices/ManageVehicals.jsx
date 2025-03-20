import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';

const ManageVehicals = () => {
    const [editedVehical, setEditedVehical] = useState({});
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedVehical, setSelectedVehical] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [initialImages, setInitialImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transportationServiceDetails, setTransportationServiceDetails] = useState({
        transportationServiceName: "",
        availableVehicles: [],
        pricePerHour: "",
        address: "",
        contactNumber: "",
        description: "",
    });

    const handleEdit = (vehical) => {
        setSelectedVehical(vehical);
        setEditedVehical(vehical);
        setShowModal(true);
        setInitialImages(vehical.images);
        setSelectedImages(vehical.images);
        document.body.classList.add('modal-open');
    };


    const handleDelete = (vehical) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this vehicle?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {


            console.log(vehical);
            
            if (result.isConfirmed) {
                try {
                    const response = await axios.put('http://localhost:3000/transportation/deleteVehical',vehical);
                    if (response.status === 200) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Vehicle deleted successfully',
                            confirmButtonColor: '#3085d6'
                        });
                        setRefresh(!refresh);
                    }
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: 'Failed to delete vehicle',
                        confirmButtonColor: '#d33'
                    });
                    console.log("Error", error);
                }
            }
        });
    };


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...newImageUrls]);
        setEditedVehical(prev => ({
            ...prev,
            imagesToUpload: [...(prev.imagesToUpload || []), ...files]
        }));
    };

    const generateSignature = (publicId, apiSecret, timestamp) => {
        const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        return CryptoJS.SHA1(str).toString();
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
            await axios.delete("http://localhost:3000/transportation/deleteVehicalImage", {
                data: { images }
            });
        } catch (error) {
            throw new Error('Failed to delete images from MongoDB');
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const removedImageUrl = initialImages[indexToRemove];
        setImagesToRemove(prev => [...(prev || []), removedImageUrl]);
        setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setInitialImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setEditedVehical(prev => ({
            ...prev,
            imagesToUpload: prev.imagesToUpload?.filter((_, index) => index !== indexToRemove)
        }));
    };

    const uploadImagesToCloudinary = async (files) => {
        const uploadedUrls = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "preset-for-file-upload");
            formData.append("cloud_name", "dqbkxghlh");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dqbkxghlh/image/upload",
                formData
            );

            if (response.status === 200) {
                uploadedUrls.push(response.data.secure_url);
            }
        }
        return uploadedUrls;
    };

    const handleSave = async () => {
        const getPublicIdFromUrl = (url) => {
            const splitUrl = url.split('/');
            const publicIdWithExtension = splitUrl[splitUrl.length - 1];
            return publicIdWithExtension.split('.')[0];
        };

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
            editedVehical.tid = transportationServiceDetails.id;

            const response = await axios.put('http://localhost:3000/transportation/editVehical', editedVehical);

            if (response.status === 200 || response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Vehicle updated successfully',
                    confirmButtonColor: '#3085d6'
                });
                setRefresh(!refresh);
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update vehicle details',
                confirmButtonColor: '#d33'
            });
            console.log("Error", error);
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

    const { id } = useParams();

    useEffect(() => {
        const fetchTransportationService = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransportationService();
    }, [refresh, id]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg " style={{ marginTop: '100px' }}>
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">{transportationServiceDetails?.transportationServiceName} - Vehicle Management</h2>
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
                                            <div className="vehical-details">
                                                <p><strong>Price:</strong> ${vehical?.price}/day</p>
                                                <p><strong>Engine Capacity:</strong> {vehical?.capacity}</p>
                                                <p><strong>Year:</strong> {vehical?.year}</p>
                                                <p><strong>Seats: </strong> {vehical?.seats}</p>
                                                <p><strong>Grade:</strong> {vehical?.grade}</p>
                                                <p><strong>Description:</strong> {vehical?.description}</p>

                                                <div className="image-gallery mb-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {vehical.images?.map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`Vehicle ${index + 1}`}
                                                                className="img-thumbnail"
                                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-primary my-2 w-100"
                                                onClick={() => handleEdit(vehical)}
                                            >
                                                Edit Vehicle
                                            </button>

                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={() => handleDelete(vehical)}
                                            >
                                                Delete Vehicle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center my-5">
                            <h4 className="text-muted">No vehicles available</h4>
                        </div>
                    )}

                    <button
                        className="btn btn-success w-100 mt-3"
                        onClick={() => navigate("/add-vehical", { state: transportationServiceDetails.id })}
                    >
                        Add New Vehicle
                    </button>
                </div>
            </div>

            {/* Edit Vehicle Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Vehicle Details</h5>
                            <button type="button"
                                className="btn-close"
                                onClick={handleClose}>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Vehicle Brand</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="brand"
                                            value={editedVehical.brand || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Vehicle Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="model"
                                            value={editedVehical.model || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Price per Day</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={editedVehical.price || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Number of Seats</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="seats"
                                            value={editedVehical.seats || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Capacity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="capacity"
                                            value={editedVehical.capacity || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Manufacturing Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="year"
                                            value={editedVehical.year || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
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
                                    <label className="form-label">Vehicle Images</label>
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {selectedImages?.map((image, index) => (
                                            <div key={index} className="position-relative">
                                                <img
                                                    src={image}
                                                    alt={`Vehicle ${index + 1}`}
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
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={isUpdating}
                            >
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
    );
};

export default ManageVehicals;