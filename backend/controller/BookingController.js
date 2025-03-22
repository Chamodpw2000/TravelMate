import { isObjectIdOrHexString } from "mongoose";
import { AccommodationModel } from "../models/Accommodation.js";
import { BookingsModel } from "../models/Bookings.js";
import GuidBooking from "../models/GuidBookings.js";
import { GuideModel } from "../models/Guide.js";

import mongoose from "mongoose";




export async function BookGuide(req, res) {





    const data = req.body;

    console.log(data);
    

    try {
        const newBooking = new GuidBooking({
            user: data.user,
            guide: data.guid,
            fromDate: data.fromDate,
            toDate: data.toDate,
            totaldays: data.totaldays,
            totalprice: data.totalprice
        });

        const savedBooking = await newBooking.save();

        await GuideModel.findOneAndUpdate(
            { id: data.guid.id },
            {
                $push: {
                    bookings: {
                        id: savedBooking._id,  // Using the MongoDB generated _id
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
export async function AddBooking(req, res) {
    try {

        const data = req.body;
        let bookings = await BookingsModel.find({});
        let id = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;

        const newBooking = new BookingsModel({
            id: id,
            user: data.user,
            room: data.room,
            accommodation: data.accommodation,
            from: data.from,
            to: data.to,
            totaldays: data.totaldays,
            totalprice: data.totalprice,
            roomcount: data.roomcount
        });

        // Save the new booking
        const savedBooking = await newBooking.save();

        await AccommodationModel.findOneAndUpdate(
            { id: data.accommodation.id },
            {
                $push: {
                    [`rooms.${data.room.id}.bookings`]: {
                        $each: Array(data.roomcount).fill({
                            id: savedBooking._id.toString(),
                            fromDate: data.from,
                            toDate: data.to,
                            totaldays: data.totaldays,
                            totalprice: data.totalprice
                        })
                    }
                }
            },
            { new: true }
        );


        // res.status(200).json({
        //     message: "Booking Saved Successfully",
        // });





        // // After booking is saved, update room availability
        // let acc = await AccommodationModel.findOneAndUpdate({
        //     "id":
        //         data.accommodation.id,
        // }, // Find the accommodation by id
        //     {
        //         $inc: { [`rooms.${[data?.room?.id]}.available`]: -data.roomcount } // Use bracket notation for dynamic key access
        //     },
        //     { new: true } // Return the updated document
        // );

        // if (!acc) {
        //     console.error("Accommodation not found or update failed.");
        //     return res.status(400).json({ error: "Accommodation update failed" }); // Send error response if accommodation is not found
        // }



        // Send a success response after both operations succeed
        res.status(200).json({
            message: "Booking Saved Successfully",
        });


    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Booking Failed" }); // Handle any errors
    }
}

export function getBookings(req, res) {

    const userEmail = req.query.email;
    // console.log(userEmail);






    BookingsModel.find(
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


export function getCBookings(req, res) {

    const userEmail = req.query.email;
    // console.log(userEmail);






    BookingsModel.find(
        {
            "user.email": userEmail,
            status: "Cancelled"
        }
    ).then((data) => {

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}

export function getComBookings(req, res) {

    const userEmail = req.query.email;
    // console.log(userEmail);






    BookingsModel.find(
        {
            "user.email": userEmail,
            status: "Completed"
        }
    ).then((data) => {

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}





export async function deleteBooking(req, res) {
    const bookingId = req.query.id;

    const booking = await BookingsModel.findById(bookingId);
    const bookingData = booking.toJSON();


    try {


        await BookingsModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    status: "Cancelled"
                }
            },
            { new: true }
        );

        await AccommodationModel.findOneAndUpdate(
            { id: bookingData.accommodation.id },
            {
                $pull: {
                    [`rooms.${bookingData.room.id}.bookings`]: {
                        id: bookingId
                    }
                }
            },
            { new: true }
        )

        // console.log(`rooms.${bookingData.room.id}.bookings`);


        await AccommodationModel.findOneAndUpdate(
            { id: bookingData.accommodation.id },
            {
                $pull: {
                    [`rooms.${bookingData.room.id}.bookings`]: {
                        id: bookingId
                    }
                }
            },
            { new: true }
        );

        console.log("okay");





        res.status(200).json({ success: true });


        console.log("okay     2");




    } catch (error) {

        console.log("case");

        console.log(error);
        res.status(400).json({
            success: false
        });

    }































}



export function getAllBookings(req, res) {

    // const userEmail = req.query.email;
    // console.log(userEmail);






    BookingsModel.find(

    ).then((data) => {

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
    })
}



export async function completeBooking(req, res) {









    const bookingId = req.query.id;



    try {

        const booking = await BookingsModel.findById(bookingId);
        const bookingData = booking.toJSON();


        await BookingsModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    status: "Completed"
                }
            },
            { new: true }
        );

        await AccommodationModel.findOneAndUpdate(
            { id: bookingData.accommodation.id },
            {
                $pull: {
                    [`rooms.${bookingData.room.id}.bookings`]: {
                        id: bookingId
                    }
                }
            },
            { new: true }
        )

        console.log(`rooms.${bookingData.room.id}.bookings`);


        await AccommodationModel.findOneAndUpdate(
            { id: bookingData.accommodation.id },
            {
                $pull: {
                    [`rooms.${bookingData.room.id}.bookings`]: {
                        id: bookingId
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




export function getAllGuidBookings(req, res) {













    GuidBooking.find(

    ).then((data) => {

        res.status(200).json(data)





    }).catch((err) => {



        console.log(err);
        res.status(400).json({
            success: false
        });
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



export async function cancleGuidBooking(req, res) {

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
                    status: "Cancelled"
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




export function getGuideBookings(req, res) {

    const userEmail = req.query.email;
    // console.log(userEmail);


    console.log(userEmail);
    






    GuidBooking.find(
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



export function getCancledGuideBookings(req, res) {

    const userEmail = req.query.email;
    console.log(userEmail);


    console.log("========================");
    






    GuidBooking.find(
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


export function getComGuideBookings(req, res) {

    const userEmail = req.query.email;
    console.log(userEmail);


    console.log("========================");
    






    GuidBooking.find(
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