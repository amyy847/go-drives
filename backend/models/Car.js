const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "car" },
});

module.exports = mongoose.model("Car", CarSchema);
