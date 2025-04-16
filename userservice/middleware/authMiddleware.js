import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token

    try {
        const decoded = jwt.verify(token, "shashin99"); // or process.env.JWT_SECRET
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({ error: "Invalid token" });
    }
}

export default verifyToken;
