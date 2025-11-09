import mongoose from "mongoose";
import ApiError from "../utils/apiError";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Database Connected');
        
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw new ApiError("Database connection failed");
    }
}