import { Schema, model, models } from "mongoose";
// Mongoose-only schema for persistence
const responseSchema = new Schema({
    transactionId: { type: String, required: true },
    version: { type: Number, required: true },
    coins: Number,
    amount: Number
}, { _id: false });
const processedTransactionSchema = new Schema({
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["purchase", "stock"], required: true },
    response: { type: responseSchema, required: true }
});
// Mongoose model (separate from TypeScript domain model)
export const ProcessedTransaction = models.ProcessedTransaction ?? model("ProcessedTransaction", processedTransactionSchema);
