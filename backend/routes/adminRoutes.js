const express = require("express");
const { approveUser } = require("../controllers/adminController");
const router = express.Router();

router.put("/approve/:userId", approveUser);

module.exports = router;
