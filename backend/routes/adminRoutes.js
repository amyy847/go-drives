const express = require("express");
const { approveUser } = require("../controllers/authController");
const router = express.Router();

router.put("/approve/:userId", approveUser);

module.exports = router;
