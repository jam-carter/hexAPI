import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProcessedTransaction extends Document {
    transactionId: string;
    type: "purchase" | "stock";
    response: {
        transactionId: string;
        version: number;
        coins?: number;
        amount?: number;
    };
}

const processedTransactionSchema = new Schema<IProcessedTransaction>({
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["purchase", "stock"], required: true },
    response: {
        transactionId: String,
        version: Number,
        coins: Number,
        amount: Number // Optional: supports both coins and amount
    }
});

export const ProcessedTransaction = models.ProcessedTransaction as mongoose.Model<IProcessedTransaction> ||
    model<IProcessedTransaction>("ProcessedTransaction", processedTransactionSchema);

//again refactor for removal of mongoose/mongo
//this file describes what a processedtran should look like to track and avoid dupes
//updated version can be our inMemory reference