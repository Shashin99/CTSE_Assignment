import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Define services
const AUTH_SERVICE_URL = "http://auth-service:5001";
const USER_SERVICE_URL = "http://user-service:5002";
const CART_SERVICE_URL = "http://cart-service:5003";
const PRODUCT_SERVICE_URL = "http://product-service:5004";

// Auth Service routes
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/auth": "" },
    })
);

// User Service routes
app.use(
    "/api/users",
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" },
    })
);

// User Service routes
app.use(
    "/api/cart",
    createProxyMiddleware({
        target: CART_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/cart": "" },
    })
);

// User Service routes
app.use(
    "/api/products",
    createProxyMiddleware({
        target: PRODUCT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/products": "" },
    })
);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "API Gateway is healthy" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
