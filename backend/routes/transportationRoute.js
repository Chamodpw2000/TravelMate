import express from 'express';
import { AddBooking, addVehical, deleteVehical, deleteVehicalImage, editVehical, getAllTransportationServices } from '../controller/TransportationServiceController.js';
const transportationrouter = express.Router();

transportationrouter.post("/addVehical",addVehical)

transportationrouter.delete("/deleteVehicalImage",deleteVehicalImage)

transportationrouter.put("/editVehical",editVehical)

transportationrouter.put("/deleteVehical",deleteVehical)

transportationrouter.get("/getAllTransportServices",getAllTransportationServices)

transportationrouter.post("/addBooking",AddBooking)




export default transportationrouter;