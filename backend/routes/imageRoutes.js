const express = require('express');
const { uploadImage } = require('./controllers/imageController');

const router = express.Router();

// Route to upload image
router.post('/upload', uploadImage);

module.exports = router;
