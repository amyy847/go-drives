const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  carModel: String,
  licensePlate: String,
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Car", CarSchema);
