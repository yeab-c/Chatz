import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export const connectToMongoDatabase = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}