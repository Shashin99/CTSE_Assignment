import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Get single user by ID
export const getUserById = async (req, res) => {
    if (req.params.id !== req.userId) { 
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findById(req.params.id).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-__v");
        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Update user by ID
export const updateUser = async (req, res) => {
    try {
        const { name, nic, email, contactNumber, password } = req.body;

        // Find user by ID
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if email or NIC or ContactNumber is being changed to an existing one
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (
                emailExists &&
                emailExists._id.toString() !== user._id.toString()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use by another user",
                });
            }
        }

        if (nic !== user.nic) {
            const nicExists = await User.findOne({ nic });
            if (nicExists && nicExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: "NIC already in use by another user",
                });
            }
        }

        if (contactNumber !== user.contactNumber) {
            const contactNumberExists = await User.findOne({ contactNumber });
            if (
                contactNumberExists &&
                contactNumberExists._id.toString() !== user._id.toString()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Contact Number already in use by another user",
                });
            }
        }

        // Update fields
        user.name = name;
        user.nic = nic;
        user.email = email;
        user.contactNumber = contactNumber;

        // Hash password only if it is provided
        if (password && password.length >= 8) {
            user.password = await bcrypt.hash(password, 8);
        }

        // Save updated user
        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};