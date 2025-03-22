import dotenv from "dotenv"
dotenv.config({ path: "../.env" })
import { TransportationServiceModel } from "../models/Transportation.js"
import VehicalBookings from "../models/VehicalBookings.js";

const AddTransportationService = async (req, res) => {

    console.log(req.body);

    try {

        let transportationServices = await TransportationServiceModel.find({});
        let id = transportationServices.length > 0 ? transportationServices[transportationServices.length - 1].id + 1 : 1;
        const transportationService = new TransportationServiceModel({
            id: id,
            transportationServiceName: req.body.transportationServiceName,
            availableVehicles: req.body.availableVehicles,
            pricePerHour: req.body.pricePerHour,
            images: req.body.images,
            address: req.body.address,
            contactNumber: req.body.contactNumber,
            description: req.body.description,
            rating: req.body.rating || 0, // Default rating to 0 if not provided
        });

        // Save the transportation service to the database
        await transportationService.save();
        return res.json({
            success: true,
            message: 'Transportation service added successfully',
            data: transportationService,
        });
    } catch (error) {
        console.error('Error adding transportation service:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const UpdateTransportationService = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the existing transportation mode with new data
        const updatedTransportMode = await TransportationServiceModel.findOneAndUpdate(
            { id: id }, // Match by ID
            {
                transportationServiceName: req.body.transportationServiceName,
                availableVehicles: req.body.availableVehicles,
                pricePerHour: req.body.pricePerHour,
                address: req.body.address,
                contactNumber: req.body.contactNumber,
                description: req.body.description,
                rating: req.body.rating,
            },
            { new: true } // Return the updated document
        );

        if (updatedTransportMode) {
            return res.json({
                success: true,
                message: 'Transportation service updated successfully',
                data: updatedTransportMode,
            });
        } else {
            return res.status(404).json({ success: false, message: 'Transportation service not found' });
        }
    } catch (error) {
        console.error('Error updating transportation service:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
const getAllTransportationServices = async (req, res) => {
    try {
        let transportationServices = await TransportationServiceModel.find({});
        // console.log("All Transportation Services Fetched");
        // console.log(transportationServices);
        res.send(transportationServices);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server Error' });

    }
};

const deleteTransportationService = async (req, res) => {
    try {
        // Find and delete the transportation service by ID
        const deletedTransportationService = await TransportationServiceModel.findOneAndDelete({ id: req.body.id });

        if (deletedTransportationService) {
            return res.json({
                success: true,
                message: `Transportation service with ID ${req.body.id} deleted successfully.`,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Transportation service not found.",
            });
        }
    } catch (error) {
        console.error("Error deleting transportation service:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the transportation service.",
        });
    }
};
const viewTransportationService = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is numeric
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        // Fetch transportation service by numeric ID
        const transportationService = await TransportationServiceModel.findOne({ id: Number(id) });

        if (!transportationService) {
            return res.status(404).json({ success: false, message: 'Transportation service not found' });
        }

        // Success response
        res.status(200).json({ success: true, data: transportationService });
    } catch (error) {
        console.error('Error fetching transportation service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const addVehical = async (req, res) => {
    console.log("============================");

    console.log(req.body);


    try {

        const data = req.body;

        let transportationService = await TransportationServiceModel.findOne({ id: data.tid });
        let vehicals = transportationService.availableVehicles;
        console.log(vehicals);





        let newId = vehicals?.length >= 1 ? vehicals[vehicals.length - 1].id + 1 : 0;


        data.id = newId;
        data.bookings = [];

        const ts = await TransportationServiceModel.findOneAndUpdate({ id: data.tid }, { $push: { availableVehicles: data } }, { new: true });
        res.status(200).json({ success: true, message: 'Vehical added successfully', data: ts });
    } catch (e) { console.log(e) }
}




const deleteVehicalImage = async (req, res) => {
    try {


        const { images } = req.body;
        console.log("Received data:", req.body);
        console.log("Hotel ID:", images.ts);
        console.log("Room ID:", images.vehical);
        console.log("Images to remove:", images.imagesToRemove);

        const updated = await TransportationServiceModel.findOneAndUpdate(
            {
                _id: images.ts,
                "availableVehicles.id": images.vehical
            },
            {
                $pull: {
                    "availableVehicles.$.images": {
                        $in: images.imagesToRemove
                    }
                }
            },
            { new: true }
        );

        // console.log("Updated document:", updated);

        if (!updated) {
            console.log("No document found or no update made");
            return res.status(404).json({ message: "Vehical or Transportation Service not found" });
        }

        res.status(200).json(updated);

    } catch (e) {
        console.log("Error occurred:", e);
        res.status(500).json({ error: e.message });
    }
}





const editVehical = async (req, res) => {

    try {


        // console.log(req.body);
        const data = req.body;


        console.log("data are", data);
        console.log(data.brand);


        console.log("============================================", data.tid);








        const updated = await TransportationServiceModel.findOneAndUpdate({
            id: data.tid,
            "availableVehicles.id": data.id
        },
            {
                $set: {
                    "availableVehicles.$.brand": data.brand,
                    "availableVehicles.$.model": data.model,

                    "availableVehicles.$.year": data.year,
                    "availableVehicles.$.seates": data.seates,

                    "availableVehicles.$.description": data.description,
                    "availableVehicles.$.price": data.price,
                    "availableVehicles.$.capacity": data.capacity,
                    "availableVehicles.$.images": data.images

                }





            }, { new: true });

        if (!updated) {
            console.log("No document found or no update made");
            return res.status(404).json({ message: "Vehical or Transportation Service not found" });
        }



        console.log("Updated document:", updated);


        res.status(200).json(updated);


    } catch (error) {

        console.log(
            "Error in editing vehicle", error
        );

        res.status(500).json({ success: false, error: "Server Error" });


    }



};




const deleteVehical = async (req, res) => {


    try {
        const data = req.body;

        const tid = data.tid;

        const vid = data.id;

        console.log("Received data:", req.body);

        console.log("Transportation Service ID:", tid);
        console.log("Vehical ID:", vid);




        const updated = await TransportationServiceModel.findOneAndUpdate(
            {
                id: tid
            },
            {
                $pull: {
                    availableVehicles: {
                        id: vid
                    }
                }
            },
            { new: true }
        );



        if (!updated) {
            console.log("No document found or no update made");
            return res.status(404).json({ message: "Vehical or Transportation Service not found" });
        }

        res.status(200).json(updated);

    } catch (e) {
        console.log("Error occurred:", e);
        res.status(500).json({ error: e.message });
    }
}







const AddBooking = async (req, res) => {





    const data = req.body;

    console.log(data);



    try {
        const newBooking = new VehicalBookings({
            user: data.user,
            vehical: data.vehicle,
            fromDate: data.fromDate,
            toDate: data.toDate,
            totaldays: data.totaldays,
            totalprice: data.totalprice
        });

        const savedBooking = await newBooking.save();

        await TransportationServiceModel.findOneAndUpdate(
            { id: data.vehicle.tid },
            {
                $push: {
                    [`availableVehicles.${data.vehicle.id}.bookings`]: {

                        id: savedBooking._id.toString(),
                        fromDate: data.fromDate,
                        toDate: data.toDate,
                        totaldays: data.totaldays,
                        totalprice: data.totalprice

                    }
                }
            },
            { new: true }
        );

        res.status(200).json({
            message: "Booking Saved Successfully",
        });




    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Booking Failed",
        });
    }

}


export function getVehicleBookings(req, res) {

    const userEmail = req.query.email;
    // console.log(userEmail);


    console.log(userEmail);







    VehicalBookings.find(
        {
            "user.email": userEmail,
            status: "Booked"
        }
    ).then((data) => {

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}



export function getCancledVehicleBookings(req, res) {

    const userEmail = req.query.email;
    console.log(userEmail);


    console.log("========================");







    VehicalBookings.find(
        {
            "user.email": userEmail,
            status: "Cancelled"
        }
    ).then((data) => {
        console.log(data);


        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}


export function getComVehicleBookings(req, res) {

    const userEmail = req.query.email;
    console.log(userEmail);


    console.log("========================");







    VehicalBookings.find(
        {
            "user.email": userEmail,
            status: "Completed"
        }
    ).then((data) => {
        console.log(data);


        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}



export async function completeGuidBooking(req, res) {

    console.log("innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");










    const bookingId = req.query.id;

    // console.log(bookingId);




    try {

        const booking = await GuidBooking.findById(bookingId);
        const bookingData = booking.toJSON();

        // console.log(bookingData);


        await GuidBooking.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    status: "Completed"
                }
            },
            { new: true }
        );





        await GuideModel.findOneAndUpdate(
            { _id: bookingData.guide._id }, // Use _id for MongoDB documents
            {
                $pull: {
                    bookings: {
                        id: new mongoose.Types.ObjectId(bookingId) // Ensure ObjectId conversion
                    }
                }
            },
            { new: true }
        );






        res.status(200).json({
            success: true
        });





    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false
        });

    }








}



export async function cancleVehicleBooking(req, res) {











    const booking = req.body.bookingData;

    console.log(booking);

   




    try {






        await VehicalBookings.findByIdAndUpdate(
            booking.bookingId,
            {
                $set: {
                    status: "Cancelled"
                }
            },
            { new: true }
        );





        await TransportationServiceModel.findOneAndUpdate(
            { id: booking.tid },
            {
                $pull: {
                    [`availableVehicles.${booking.vid}.bookings`]: {
                        id: booking.bookingId
                    }
                }
            },
            { new: true }
        );






        res.status(200).json({
            success: true
        });





    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false
        });

    }












}



export function getAllBookings(req, res) {











    VehicalBookings.find().then((data) => {
       

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}

export async function completeVehicleBooking(req, res) {

    console.log("innnnnnnnnnnnnnnnn bbbbbbbbbbbbbbbbbbbbb");
    











    const booking = req.body.bookingData;

    console.log(booking);

   




    try {






        await VehicalBookings.findByIdAndUpdate(
            booking.bookingId,
            {
                $set: {
                    status: "Completed"
                }
            },
            { new: true }
        );





        await TransportationServiceModel.findOneAndUpdate(
            { id: booking.tid },
            {
                $pull: {
                    [`availableVehicles.${booking.vid}.bookings`]: {
                        id: booking.bookingId
                    }
                }
            },
            { new: true }
        );






        res.status(200).json({
            success: true
        });





    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false
        });

    }












}



export { AddTransportationService, getAllTransportationServices, UpdateTransportationService, deleteTransportationService, viewTransportationService, addVehical, deleteVehicalImage, editVehical, deleteVehical, AddBooking };
