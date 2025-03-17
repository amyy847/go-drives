// controllers/UserController.js

const User = require('../models/User');

// Fetch all users with status filtering
exports.getAllUsers = async (req, res) => {
    try {
        const status = req.query.status;
        const filter = status ? { status } : {};
        const users = await User.find(filter);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Fetch a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Approve a user (set status to "active")
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: 'true' }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error approving user' });
    }
};

// Deactivate a user (set status to "inactive")
exports.deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: 'false' }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error deactivating user' });
    }
};
