import { Request, Response } from "express";
import { AddStock } from "../../application/use-cases/AddStock";

const addStockUseCase = new AddStock();

// Adds stock to a product with idempotency
export async function addStockController(req: Request, res: Response): Promise<void> {
    try {
        const { transactionId, amount, sku } = req.body;

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
