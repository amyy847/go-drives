const { cloudinary } = require("../utils/cloudinary");
const multer = require("multer");

// Multer memory storage (stores file in RAM instead of disk)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  storage: multer.memoryStorage(), // Store file in memory (RAM)
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Convert buffer to Base64 format for Cloudinary upload
    const base64Image = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

    // Upload the image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "idPictures",
    });

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
