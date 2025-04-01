import { Schema, model, models, InferSchemaType } from "mongoose";

const ProductSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    version: { type: Number, required: true, default: 1 },
    lastTransactionId: { type: String, required: true }
});

export type IProduct = InferSchemaType<typeof ProductSchema>;

export const Product = models.Product || model("Product", ProductSchema);

//removing mongo and mongoose, dont need define schem
//simplify IProduct type and requirements
