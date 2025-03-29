const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id/approve', UserController.approveUser);
router.put('/:id/deactivate', UserController.deactivateUser);
router.put('/:id/activate', UserController.activateUser);

module.exports = router;
