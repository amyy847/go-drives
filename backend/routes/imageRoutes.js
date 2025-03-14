const express = require("express");
const { upload } = require("../utils/cloudinary"); // Import Multer setup
const { uploadImage } = require("../controllers/imageController");

const router = express.Router();

// Upload Image Route
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
