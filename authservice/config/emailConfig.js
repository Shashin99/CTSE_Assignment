import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER || "0260dff1dc0f49",
        pass: process.env.MAILTRAP_PASS || "a99e3cc9b802ad"
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Configuration Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

export default transporter; 