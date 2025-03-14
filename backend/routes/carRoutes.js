const express = require("express");
const { addCar, getCars } = require("../controllers/carController");

const router = express.Router();

router.post("/add", addCar);
router.get("/", getCars);

module.exports = router;
