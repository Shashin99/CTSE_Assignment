import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    verifyTokenReg,
    refreshToken,
    forgotPassword,
    resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

// User registration
router.post("/register", registerUser);

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", verifyToken, getUserById);

// Update user
router.put("/:id", verifyToken, updateUser);

// Delete user
router.delete("/:id", verifyToken, deleteUser);

// User login
router.post("/login", loginUser);

// Verify token
router.get("/verify", verifyTokenReg);

// Refresh token
router.post("/refresh", refreshToken);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

export default router;
