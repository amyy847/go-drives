const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/car", carRoutes);
app.use("/api/user", userRoutes);

app.use(bodyParser.json()); // ✅ Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

  app._router.stack.forEach((r) => {
    if (r.route) {
      console.log(r.route.path); // Logs the defined routes
    } else if (r.name === "router") {
      r.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(handler.route.path); // Logs nested router paths
        }
      });
    }
  });
  

app.listen(5000, () => console.log("Server running on port 5000"));
