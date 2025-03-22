import dotenv from "dotenv";
import mongoose from 'mongoose';
import { AccommodationModel } from "../models/Accommodation.js";
import { CityModel } from "../models/Citiy.js";
import { DestinationModel } from "../models/Destination.js";
import { GuideModel } from "../models/Guide.js";
import { HotelReviewModel } from "../models/HotelReview.js";

// dotenv.config({ path: "../.env" });

// Add Accommodation API
const addAccommodation = async (req, res) => {
    try {
        let hotels = await AccommodationModel.find({});
        let newId = hotels.length > 0 ? hotels[hotels.length - 1].id + 1 : 1;

        const hotel = new AccommodationModel({
            id: newId,
            name: req.body.name,
            address: req.body.address,
            description: req.body.description,
            image: req.body.cardImage,
            category: req.body.category,
            distance_from_city: req.body.distance_from_city,
            perPerson_price: req.body.perPerson_price,
            contactNumber: req.body.contactNumber,
        });

        await hotel.save();
        return res.json({
            success: true,
            message: 'Hotel added successfully',
            data: hotel,
        });
    } catch (error) {
        console.error("Error saving hotel:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update Accommodation API
const updateAccommodation = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHotel = await AccommodationModel.findOneAndUpdate(
            { id: id },
            {
                name: req.body.name,
                address: req.body.address,
                description: req.body.description,
                image: req.body.cardImage,
                category: req.body.category,
                distance_from_city: req.body.distance_from_city,
                perPerson_price: req.body.perPerson_price,
                contactNumber: req.body.contactNumber,
            },
            { new: true }
        );

        if (updatedHotel) {
            return res.json({
                success: true,
                message: 'Hotel updated successfully',
                data: updatedHotel,
            });
        } else {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


const getAllAccomodations = async (req, res) => {
    try {
        let hotels = await AccommodationModel.find({});
        res.send(hotels);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const GetData = async (req, res) => {
    try {
        const cities = await CityModel.find();
        const accommodations = await AccommodationModel.find();
        const destinations = await DestinationModel.find();
        const guids = await GuideModel.find();


    
    
        return res.status(200).json({ success: true, cities,accommodations,destinations,guids  });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ success: false, error: err.message });
    }
};

const GetCity = async (req, res) => {
    const { id } = req.params;

    try {
        const city = await CityModel.findOne({ _id: id });
        // console.log(city);

        return res.status(200).json({ success: true, city });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ success: false, error: err.message });
    }
};

// API to delete a Hotel
const deleteAccommodation = async (req, res) => {
    try {
        const deletedHotel = await AccommodationModel.findOneAndDelete({ id: req.body.id });
        if (deletedHotel) {
            res.json({
                success: true,
                message: `Hotel with ID ${req.body.id} deleted successfully.`,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Hotel not found.",
            });
        }
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the hotel.",
        });
    }
};

const viewAccommodation = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is numeric
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        // Fetch accommodation by numeric ID
        const accommodation = await AccommodationModel.findOne({ id: Number(id) });

        if (!accommodation) {
            return res.status(404).json({ success: false, message: 'Accommodation not found' });
        }

        // Success response
        res.status(200).json({ success: true, data: accommodation });
    } catch (error) {
        console.error('Error fetching accommodation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}; 

const addHotelReview = async (req, res) =>{
    try{
    
        let hotelReviews = await HotelReviewModel.find({});
        let id = hotelReviews.length > 0 ? hotelReviews[hotelReviews.length - 1].id + 1 : 1;
        let hotelReview = new HotelReviewModel({
            id: id,
            userName: req.body.userName,
            hotelId: req.body.hotelId,
            overallRating: req.body.overallRating,
            roomRating: req.body.roomRating,
            serviceRating: req.body.serviceRating,
            valueRating: req.body.valueRating,
            locationRating: req.body.locationRating,
            visitDate: req.body.visitDate,
            travelType: req.body.travelType,
            stayDuration: req.body.stayDuration,
            reviewBody: req.body.body,
            reviewTitle: req.body.title
        })

        // console.log(hotelReview);
        await hotelReview.save();
        res.json({
            success: true,
            message: 'Hotel review added successfully'
        });

    } catch (error){
        console.log(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}


const getAllHotelReviews = async (req, res) => {
    try{
        let allHotelReviews = await HotelReviewModel.find({});
        // console.log("All Hotel Reviews Fetched");
        // console.log(allHotelReviews);
        res.send(allHotelReviews);

    } catch(error){
        console.log(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}


const addRoom  = async(req,res)=>{
// console.log(req.body);

    
    try{

        const data = req.body;

        let hotell = await AccommodationModel.findOne({id: data.hid});
        let rooms = hotell.rooms;
        // console.log(rooms);


        
        
        
        let newId = rooms?.length>= 1 ? rooms[rooms.length - 1].id + 1 : 0;
        
        // console.log(data);

        data.id = newId;
        data.bookings = [];

        const hotel = await AccommodationModel.findOneAndUpdate({id: data.hid},{ $push: { rooms: data } },{new:true});
        // console.log(hotel);

        res.status(200).json({ success: true, message: 'Room added successfully', data: hotel });


        

        



    }catch(e){console.log(e)}
}




const deleteRoomImage = async(req,res) => {
    try {
        const { images } = req.body;
        // console.log("Received data:", req.body);
        // console.log("Hotel ID:", images.hotel);
        // console.log("Room ID:", images.room);
        // console.log("Images to remove:", images.imagesToRemove);
        
        const updated = await AccommodationModel.findOneAndUpdate(
            {
                _id: images.hotel,
                "rooms.id": images.room
            },
            {
                $pull: {
                    "rooms.$.images": {
                        $in: images.imagesToRemove
                    }
                }
            },
            {new: true}
        );

        // console.log("Updated document:", updated);
        
        if (!updated) {
            console.log("No document found or no update made");
            return res.status(404).json({message: "Hotel or room not found"});
        }

        res.status(200).json(updated);
        
    } catch(e) {
        console.log("Error occurred:", e);
        res.status(500).json({error: e.message});
    }
}




const editRoom = async(req,res) => {

    try {


        // console.log(req.body);
        const  data  = req.body;
        

     console.log("data are",data);

     console.log(data.hid);
     
     
        
        
    
    
        const updated = await AccommodationModel.findOneAndUpdate(  {
            id: data.hid,
            "rooms.id": data.id
        },
        {
            $set: {
                "rooms.$.name": data.name,
                "rooms.$.description": data.description,
                "rooms.$.price": data.price,
                "rooms.$.capacity": data.capacity,
                "rooms.$.images": data.images  

            }

            
           
        })

        res.status(200).json(updated);
        
        
    } catch (error) {

        console.log(
            "Error in editing room",error
        );

        res.status(500).json({ success: false, error: "Server Error" });
        
        
    }

   
    
};






export { deleteRoomImage , updateAccommodation,addAccommodation, GetData,GetCity, getAllAccomodations, deleteAccommodation,viewAccommodation,addRoom, editRoom, addHotelReview, getAllHotelReviews };








