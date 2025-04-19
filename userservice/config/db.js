import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://CTSE:CTSE@ctse.kewjrct.mongodb.net/ctse?retryWrites=true&w=majority&appName=CTSE",
            {
                dbName: "CTSE",
                retryWrites: true,
                w: "majority",
            }
        );
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
