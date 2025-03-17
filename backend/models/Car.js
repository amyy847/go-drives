const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "car" },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Car", CarSchema);
