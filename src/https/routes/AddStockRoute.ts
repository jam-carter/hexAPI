import { Request, Response } from "express";
import { AddStockHandler } from "../../domain/handlers/AddStockHandler";

const addStockUseCase = new AddStockHandler();

// move all req validation to top using Zod schema
export async function addStockRoute(req: Request, res: Response): Promise<void> {
    try {
        const { transactionId, amount, sku } = req.body;

        //changed to zod validation
        if (!transactionId) {
            throw new Error("Missing transactionId in request body.");
        }

        const { product, isNew, isDuplicate } = await addStockUseCase.execute(sku, amount, transactionId);

        const statusCode = isNew ? 201 : 202;

        // Return stock response (duplicate check handled in message)
        res.status(statusCode).json({
            transactionId,
            version: product.version,
            amount: product.amount,
            ...(isDuplicate && { message: "Duplicate stock transaction" })
        });

    } catch (error: any) {
        console.error("Error in AddStockController:", error.message);
        res.status(400).json({ error: error.message });
    }
}

//zod good for checking the data; no need to rewrite information guidelines in every file
//essentially a checklist for data before its used