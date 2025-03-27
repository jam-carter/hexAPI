import { Schema, model, models, InferSchemaType } from "mongoose";

// Defines schema for a product in inventory
const ProductSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    version: { type: Number, required: true, default: 1 },
    lastTransactionId: { type: String, required: true }
});

// Infers TypeScript type from schema
export type IProduct = InferSchemaType<typeof ProductSchema>;

// Exports Product model (prevents redefinition in hot reload)
export const Product = models.Product || model("Product", ProductSchema);
