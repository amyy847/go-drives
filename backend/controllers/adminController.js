const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User approved", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User rejected", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
