import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Initialize Express
const app = express();

// CORS Configuration
app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

//Routes
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
