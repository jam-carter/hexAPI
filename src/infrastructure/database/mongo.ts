import mongoose from "mongoose";

const MONGO_URI: string = process.env.MONGO_URI!;

export async function connectToMongoDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
