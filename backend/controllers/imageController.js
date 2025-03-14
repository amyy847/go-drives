const { cloudinary } = require("../utils/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Cloudinary automatically handles uploads via Multer
    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { uploadImage };
