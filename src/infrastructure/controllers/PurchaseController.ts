import { Request, Response } from "express";
import { PurchaseStock } from "../../application/use-cases/PurchaseStock";

const purchaseUseCase = new PurchaseStock();

// Handles purchase requests
export async function purchaseController(req: Request, res: Response): Promise<void> {
    try {
        const { transactionId } = req.body;
        const amount = req.body.amount ?? req.body.coins; // Support both field names
        const { sku } = req.params;

        // Execute purchase logic
        const { product, isDuplicate } = await purchaseUseCase.execute(sku, amount, transactionId);

        // Respond with result
        res.status(isDuplicate ? 202 : 201).json({
            transactionId,
            version: product.version,
            coins: product.amount,
            message: isDuplicate ? "Duplicate purchase" : "Purchase successful"
        });

    } catch (error: any) {
        console.error("Purchase failed:", error.message);

        // Handle known errors
        if (error.message === "Insufficient stock") {
            res.status(400).json({ error: "Insufficient stock" });
        } else if (error.message === "Product not found") {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}
