const express = require("express");
const { registerUser, login } = require("../controllers/authController");
const { upload } = require("../utils/cloudinary"); // ✅ Multer Cloudinary storage
const router = express.Router();

router.post("/register", upload.none(), registerUser);
router.post("/login", login);

module.exports = router;


