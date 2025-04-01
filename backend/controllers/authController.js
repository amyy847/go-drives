const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Car = require("../models/Car");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, gucEmail, phoneNumber, idNumber, password, role, major } = req.body;
    console.log("🟢 Register API called with data:", req.body);
    // ✅ Ensure ID picture has a default value
    const idPicture = "https://dummyimage.com/600x400/000/fff&text=Dummy+ID"; 

    // ✅ Fix duplicate password assignment
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      username,
      gucEmail,
      phoneNumber,
      idNumber,
      idPicture,
      password: hashedPassword, // ✅ Use only the hashed password
      role,
      major,
    });

    await user.save();
    res.status(201).json({ message: "User registered. Awaiting admin approval." });
  } catch (error) {
    console.error("Registration Error from backend:", error); // ✅ Log error for debugging
    res.status(400).json({ error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user, role;

    // Search in Admin collection
    user = await Admin.findOne({ username });
    if (user) {
      role = "admin";
    } else {
      // Search in User collection
      user = await User.findOne({ username });
      if (user) {
        role = "user";
      } else {
        // Search in Car collection
        user = await Car.findOne({ username });
        if (user) {
          role = "car";
        }
      }
    }

    // If user not found in any collection
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role,
      username,
      isApproved: user.isApproved ?? null,
      isActive: user.isActive ?? null,
      id: user._id,
    });
      } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





const registerAdmin = async (req, res) => {
  try {
    const {username, email, password } = req.body;
    console.log("🟢 Register Admin API called with data:", req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error("Admin Registration Error from backend:", error);
    res.status(400).json({ error: error.message });
  }
};

const registerCar = async (req, res) => {
  try {
    const { username,password } = req.body;
    console.log("🟢 Register Car API called with data:", req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const car = new Car({
      username,
      password: hashedPassword,
    });

    await car.save();
    res.status(201).json({ message: "Car registered successfully." });
  } catch (error) {
    console.error("Car Registration Error from backend:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, login, registerAdmin, registerCar };
