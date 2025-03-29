const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text, isHtml = false) => {
    try {
        await transporter.sendMail({
            from: `"GoDrives Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: isHtml ? undefined : text,  // Send text if not HTML
            html: isHtml ? text : undefined,  // Send HTML if specified
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

module.exports = sendEmail;
