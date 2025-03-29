const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "car" },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  numberOfPassengers: { type: Number },
  batteryLevel: { type: Number },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  currentRoute: {
    startLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    endLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    }, 
    //list of locations so we follow the optimized route hana creates
  },
  currentDestination: {
    latitude: { type: Number },
    longitude: { type: Number },
    name: { type: String },
  },


});

module.exports = mongoose.model("Car", CarSchema);
