// controllers/CarController.js

const Car = require('../models/Car');

// Fetch all cars with status filtering
exports.getAllCars = async (req, res) => {
    try {
        const status = req.query.status;
        const filter = status ? { status } : {};
        const cars = await Car.find(filter);
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars' });
    }
};

// Fetch a single car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching car' });
    }
};

// Approve a car (set status to "active")
exports.approveCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error approving car' });
    }
};

// Deactivate a car (set status to "inactive")
exports.deactivateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error deactivating car' });
    }
};

// Activate a car (set status to "active")
exports.activateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, { isActive: 'true' }, { new: true });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error activating car' });
    }
};

// Save the current location of a car
exports.saveCarLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { currentLocation: { latitude, longitude } },
            { new: true }
        );
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Error saving car location' });
    }
};
