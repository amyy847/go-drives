const express = require('express');
const router = express.Router();
const CarController = require('../controllers/carController');

router.get('/', CarController.getAllCars);
router.get('/:id', CarController.getCarById);
router.put('/:id/approve', CarController.approveCar);
router.put('/:id/deactivate', CarController.deactivateCar);

module.exports = router;
