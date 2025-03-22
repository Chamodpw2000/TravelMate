import express from 'express';
import { AddBooking, addVehical, cancleVehicleBooking, completeVehicleBooking, deleteVehical, deleteVehicalImage, editVehical, getAllBookings, getAllTransportationServices, getCancledVehicleBookings, getComVehicleBookings, getVehicleBookings } from '../controller/TransportationServiceController.js';
const transportationrouter = express.Router();

transportationrouter.post("/addVehical",addVehical)

transportationrouter.delete("/deleteVehicalImage",deleteVehicalImage)

transportationrouter.put("/editVehical",editVehical)

transportationrouter.put("/deleteVehical",deleteVehical)

transportationrouter.get("/getAllTransportServices",getAllTransportationServices)

transportationrouter.post("/addBooking",AddBooking)

transportationrouter.get("/getBooking",getVehicleBookings)

transportationrouter.get("/getcancelBooking",getCancledVehicleBookings)

transportationrouter.get("/getCompletedBooking",getComVehicleBookings)

transportationrouter.put("/canclebooking",cancleVehicleBooking)

transportationrouter.get("/getallbookings",getAllBookings)

transportationrouter.put("/completebooking", completeVehicleBooking)
export default transportationrouter;