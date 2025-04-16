import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", verifyToken, getUserById);

// Update user
router.put("/:id", verifyToken, updateUser);

// Delete user
router.delete("/:id", verifyToken, deleteUser);

export default router;
