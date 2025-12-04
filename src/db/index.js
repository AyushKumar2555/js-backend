import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


// This function connects MongoDB using async–await
const connectDB = async () => {
    try {
        //  Await stops execution until MongoDB connects successfully
        //  process.env.MONGODB_URL + DB_NAME forms the full connection string
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );

        //  Print the host of the connected database (useful for debugging & logs)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        //  If connection fails, log the error
        console.log("MongoDB connection error:", error);

        //  Stop the app immediately to avoid running server without DB
        process.exit(1);
    }
};

export default connectDB;  // Exporting so index.js can call this function
