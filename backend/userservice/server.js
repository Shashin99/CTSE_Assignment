import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`User Service running on ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
