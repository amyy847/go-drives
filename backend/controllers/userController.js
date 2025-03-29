// controllers/UserController.js

const User = require('../models/User');
const sendEmail = require("../utils/emailService"); // Import email function

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
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        const subject = "🎉 Welcome to GoDrives – Your Account is Approved!";
        const message = `
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>Great news! Your account has been successfully approved, and you can now start using <strong>GoDrives</strong> – the ultimate solution for seamless transportation on the GUC campus.</p>
            <h3>🚗 What you can do now:</h3>
            <ul>
                <li>Book rides conveniently around campus.</li>
                <li>Connect with trusted drivers and fellow students.</li>
                <li>Enjoy a safer and more efficient commuting experience.</li>
            </ul>
            <p><strong>Log in now and explore the features! 🚀</strong></p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br><strong>GoDrives Team</strong></p>
        `;

        await sendEmail(user.gucEmail, subject, message, true);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error approving user" });
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        const subject = "🚨 Account Deactivated – Important Notice";
        const message = `
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>We regret to inform you that your <strong>GoDrives</strong> account has been <strong>deactivated</strong> due to a violation of our platform guidelines.</p>
            <h3>📌 Possible Reasons:</h3>
            <ul>
                <li>Inappropriate behavior or misuse of the platform.</li>
                <li>Violation of <strong>GoDrives</strong> policies or university regulations.</li>
                <li>Other security concerns raised by our team.</li>
            </ul>
            <p>If you believe this was a mistake or would like to discuss reactivation, please contact <strong>GUC Administration</strong> or <strong>GoDrives Support</strong> at <a href="mailto:support@godrives.com">support@godrives.com</a>.</p>
            <p>Best regards,<br><strong>GoDrives Support Team</strong></p>
        `;

        await sendEmail(user.gucEmail, subject, message, true);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error deactivating user" });
    }
};

exports.activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        const subject = "✅ Account Reactivated – Welcome Back!";
        const message = `
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>Good news! Your <strong>GoDrives</strong> account has been <strong>reactivated</strong>, and you can now resume using our platform for easy and safe transportation on GUC campus.</p>
            <h3>🔄 Why was your account reactivated?</h3>
            <ul>
                <li>Your issue has been reviewed and resolved.</li>
                <li>You’ve met the necessary conditions for reactivation.</li>
                <li>We've verified that your account is now in good standing.</li>
            </ul>
            <p>Feel free to log in and continue enjoying <strong>GoDrives</strong>. If you have any concerns, don’t hesitate to contact us.</p>
            <p>Best regards,<br><strong>GoDrives Support Team</strong></p>
        `;

        await sendEmail(user.gucEmail, subject, message, true);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error activating user" });
    }
};
