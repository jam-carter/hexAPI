import mongoose from "mongoose";

const MONGO_URI: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/store_db1";

export async function connectToMongoDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
