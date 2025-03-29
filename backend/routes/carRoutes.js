const express = require('express');
const router = express.Router();
const CarController = require('../controllers/carController');

router.get('/', CarController.getAllCars);
router.get('/:id', CarController.getCarById);
router.put('/:id/approve', CarController.approveCar);
router.put('/:id/deactivate', CarController.deactivateCar);
router.put('/:id/activate', CarController.activateCar);
router.put('/:id/location', CarController.saveCarLocation);


module.exports = router;
