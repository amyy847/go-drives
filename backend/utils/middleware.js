const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { authenticate, isAdmin };
