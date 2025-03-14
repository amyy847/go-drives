const express = require("express");
const { uploadImage } = require("../controllers/imageController");
const upload = require("../utils/cloudinary"); // Middleware for Cloudinary

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
