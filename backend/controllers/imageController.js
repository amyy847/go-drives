const cloudinary = require("../utils/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error });
  }
};
