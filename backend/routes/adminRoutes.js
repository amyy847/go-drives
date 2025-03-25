const express = require("express");
const { approveUser, rejectUser } = require("../controllers/adminController");

const router = express.Router();

router.put("/approve/:userId", approveUser);
router.put("/reject/:userId", rejectUser);

module.exports = router;
