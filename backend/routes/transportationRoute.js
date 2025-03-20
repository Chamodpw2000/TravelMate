import express from 'express';
import { addVehical, deleteVehical, deleteVehicalImage, editVehical } from '../controller/TransportationServiceController.js';
const transportationrouter = express.Router();

transportationrouter.post("/addVehical",addVehical)

transportationrouter.delete("/deleteVehicalImage",deleteVehicalImage)

transportationrouter.put("/editVehical",editVehical)

transportationrouter.put("/deleteVehical",deleteVehical)


export default transportationrouter;