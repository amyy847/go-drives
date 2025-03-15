const express = require("express");
const { registerUser, login, registerAdmin, registerCar } = require("../controllers/authController");
const { upload } = require("../utils/cloudinary"); // ✅ Multer Cloudinary storage
const router = express.Router();

router.post("/registerUser", upload.none(), registerUser);
router.post("/registerAdmin", registerAdmin); // Add route for registering admin
router.post("/registerCar", registerCar); // Add route for registering car
router.post("/login", login);

module.exports = router;


