import { model } from "mongoose";

const VehicalBookings = model("VehicalBookings", {


    user: {
        type: Object,
        required: true
    },
    vehical: {
        type: Object,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    totaldays: {
        type: Number,
        required: true
    },
    totalprice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Booked"
    },






});

export default VehicalBookings;