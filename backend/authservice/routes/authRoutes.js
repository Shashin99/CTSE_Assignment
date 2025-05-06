import express from "express";
import { registerUser, loginUser, verifyToken, refreshToken, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verify", verifyToken);

router.post("/refresh", refreshToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
