import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "CTSE",
            retryWrites: true,
            w: "majority",
        });
        console.log("MongoDB Connected Successfully!");
        console.log(`MongoDB Database: ${conn.connection.db.databaseName}`);
        return conn;
    } catch (err) {
        console.error(`MongoDB Connection Failed: ${err.message}`);
        console.error("Error:", err);
        process.exit(1);
    }
};

export default connectDB;
