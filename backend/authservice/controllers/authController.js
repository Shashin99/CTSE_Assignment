import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import transporter from "../config/emailConfig.js";

// Register user
export const registerUser = async (req, res) => {
    try {
        const { name, nic, email, contactNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { nic }, { contactNumber }],
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "User already exists with this email or NIC or contactNumber",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        // Create new user with hashed password
        const newUser = new User({
            name,
            nic,
            email,
            contactNumber,
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        // Check if the password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        // Generate access token
        const token = jwt.sign({ userId: user._id }, "shashin99", {
            expiresIn: "1h",
        });

        // Generate refresh token (longer expiration)
        const refreshToken = jwt.sign({ userId: user._id }, "shashin99", {
            expiresIn: "7d",
        });

        res.status(200).json({
            token: token,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                nic: user.nic,
                contactNumber: user.contactNumber
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Internal server error"
        });
    }
};

// Verify token
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ valid: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, "shashin99");
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }

        res.status(200).json({ 
            valid: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                nic: user.nic,
                contactNumber: user.contactNumber
            }
        });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ valid: false, message: "Invalid token" });
    }
};

// Refresh token
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, "shashin99");
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Generate new access token
        const newToken = jwt.sign({ userId: user._id }, "shashin99", {
            expiresIn: "1h",
        });

        res.status(200).json({ 
            token: newToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                nic: user.nic,
                contactNumber: user.contactNumber
            }
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email using Mailtrap
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Password reset email sent" });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // If email fails, remove the reset token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ message: "Failed to send reset email" });
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
