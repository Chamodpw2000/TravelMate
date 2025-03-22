import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddVehicle = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tid = location.state;
    const [isLoading, setIsLoading] = useState(false);
    
    const [vehicalData, setvehicalData] = useState({
        brand: '',
        model: '',
        year: '',
        price: '',
        capacity: '',
        seates: '',    
        grade: '',
        description: '',
        images: null
    });

    const [selectedImages, setSelectedImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setvehicalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(prevImages =>
            prevImages.filter((_, index) => index !== indexToRemove)
        );
        setvehicalData(prevState => ({
            ...prevState,
            images: prevState.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setSelectedImages(prevImages => [...prevImages, ...newPreviewUrls]);
        setvehicalData(prev => ({
            ...prev,
            images: [...(prev.images || []), ...newFiles]
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const uploadedImages = await uploadImagesToCloudinary(vehicalData.images);
            
            const data = {
                ...vehicalData,
                images: uploadedImages,
                tid: tid,
                price: parseFloat(vehicalData.price),
                
                
            };

            console.log(data);
            
    
            await axios.post('http://localhost:3000/transportation/addVehical', data);
            
            setIsLoading(false);
            
            Swal.fire({
                title: 'Success!',
                text: 'Vehical added successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/');
            });
    
        } catch (error) {
            setIsLoading(false); // Clear loading state in case of error
            console.log("Error in adding Vehical", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add room',
                icon: 'error'
            });
        }
    };
    

    const clearForm = () => {
        setRoomData({
            name: '',
            price: '',
            capacity: '',
            total: '',
            grade: '',
            description: '',
            images: null
        });
        setSelectedImages([]);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg" style={{ marginTop: '100px' }}>
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Add New Vehical</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vehical Brand</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="brand"
                                    value={vehicalData.brand}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vehical Model</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="model"
                                    value={vehicalData.model}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Manufacturing Year</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="year"
                                    value={vehicalData.year}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Grade</label>
                                <select
                                    className="form-select"
                                    name="grade"
                                    value={vehicalData.grade}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Price Per Day</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={vehicalData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>


                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Endgine Capacity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="capacity"
                                    value={vehicalData.capacity}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        
                          

                            <div className="col mb-3">
                                <label className="form-label">Number of Seates</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="seates"
                                    value={vehicalData.seates}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={vehicalData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Vehical Images</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                multiple
                                style={{ color: 'transparent' }}
                            />
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="mb-4">
                                <label className="form-label">Image Preview</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {selectedImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="position-relative"
                                            style={{ maxWidth: '300px' }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Room preview ${index + 1}`}
                                                className="img-fluid rounded"
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                                onClick={() => removeImage(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="d-grid gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Adding Vehicle...
                                    </>
                                ) : (
                                    'Add Vehical'
                                )}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-lg" 
                                onClick={clearForm}
                            >
                                Clear Form
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-lg" 
                                onClick={() => navigate('/manage-rooms')}
                            >
                                Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                     style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="text-white text-center">
                        <div className="spinner-border mb-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div>Processing...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddVehicle;
