const express = require("express");
const { upload, uploadImage } = require("../controllers/imageController");

const router = express.Router();

router.post("/upload", upload.single("idPicture"), uploadImage);

module.exports = router;
