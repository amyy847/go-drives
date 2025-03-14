const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gucEmail: { type: String, required: true, unique: true },
  phoneNumber: String,
  idNumber: String,
  idPicture: String, // Cloudinary URL
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
