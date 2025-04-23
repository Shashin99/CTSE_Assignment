import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

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
        if (!user) return res.status(401).json({ error: "User not found" });

        // Log both password and hashed password for debugging
        console.log("Password from request:", password);
        console.log("Hashed password from DB:", user.password);

        // Check if the password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT toke
        const token = jwt.sign({ userId: user._id }, "shashin99", {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id, // Include user ID
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
