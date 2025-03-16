const { cloudinary } = require("../utils/cloudinary");
const multer = require("multer");

// Multer memory storage (stores file in RAM instead of disk)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  storage: multer.memoryStorage(), // Store file in memory (RAM)
});

// Upload image function
const uploadImage = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Convert the Base64 string from the frontend into a buffer
    const base64Image = req.body.image.split(';base64,').pop();
    const buffer = Buffer.from(base64Image, 'base64');

    // Upload the image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(buffer, {
      folder: "idPictures",
      resource_type: "auto", // Automatically detect the file type (jpeg, png, etc.)
    });

    // Return the URL of the uploaded image
    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: uploadedResponse.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Export upload middleware & controller function
module.exports = { upload, uploadImage };
