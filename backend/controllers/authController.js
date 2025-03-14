const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, gucEmail, phoneNumber, idNumber, idPicture, password } = req.body;

    const existingUser = await User.findOne({ gucEmail });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName, lastName, gucEmail, phoneNumber, idNumber, idPicture,
      password: hashedPassword, isApproved: false
    });

    await newUser.save();
    res.status(201).json({ message: "User registered, pending approval" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { gucEmail, password } = req.body;

    const user = await User.findOne({ gucEmail });
    if (!user || !user.isApproved) return res.status(400).json({ message: "User not approved or not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
