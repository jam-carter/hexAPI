import { Schema, model, models, Document } from "mongoose";

// Interface representing a processed transaction (used for idempotency)
export interface IProcessedTransaction extends Document {
    transactionId: string;
    response: {
        transactionId: string;
        version: number;
        coins: number;
    };
}

// Schema to track completed stock or purchase transactions
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

// Export the model (use existing if reloaded)
export const ProcessedTransaction = models.ProcessedTransaction as ReturnType<typeof model<IProcessedTransaction>> ||
    model<IProcessedTransaction>("ProcessedTransaction", processedTransactionSchema);
