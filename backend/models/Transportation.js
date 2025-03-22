import { model } from "mongoose";

const TransportationServiceModel = model("TransportationServices", {
  id: { type: Number, required: true },
  type: {
    type: String,
    default: "TransportationServices",
  },
  transportationServiceName: {
    type: String,
    required: true,
  },
  availableVehicles: {
    type: [Object],
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  images: {
    type: [String],
    default: [],
    required: true,
  },
});

export { TransportationServiceModel };
