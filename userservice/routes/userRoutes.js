import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", verifyToken, getUserById);

// Update user
router.put("/:id", verifyToken, updateUser);

// Delete user
router.delete("/:id", verifyToken, deleteUser);

export default router;
