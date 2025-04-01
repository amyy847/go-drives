const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "car" },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  numberOfPassengers: { type: Number },
  batteryLevel: { type: Number },
  currentSpeed: { type: Number },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  currentRoute: {
    startLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    secondLocation:{
      latitude: { type: Number },
      longitude: { type: Number },
    },
    endLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    }, 
  },
  currentDestination: {
    latitude: { type: Number },
    longitude: { type: Number },
    name: { type: String },
  },


});

module.exports = mongoose.model("Car", CarSchema);
