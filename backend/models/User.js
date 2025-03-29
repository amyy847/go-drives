const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, required: true, unique: true },
  gucEmail: { type: String, required: true, unique: true },
  phoneNumber: String,
  idNumber: { type: String, required: true, unique: true },
  idPicture: String, // Cloudinary URL
  password: { type: String, required: true },
  major: String,
  role: { type: String, default: "user" },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
