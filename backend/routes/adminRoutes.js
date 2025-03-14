const express = require("express");
const { approveUser, getUsers } = require("../controllers/adminController");
const { authenticate, isAdmin } = require("../utils/middleware");

const router = express.Router();

router.get("/users", authenticate, isAdmin, getUsers);
router.put("/approve/:id", authenticate, isAdmin, approveUser);

module.exports = router;
