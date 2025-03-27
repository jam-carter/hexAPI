import { Request, Response } from "express";
import { GetInventory } from "../../application/use-cases/GetInventory";

const getInventoryUseCase = new GetInventory();

// Returns current inventory for a product
export async function getInventoryController(req: Request, res: Response): Promise<void> {
    try {
        const { sku } = req.params;

        const product = await getInventoryUseCase.execute(sku);

        // Respond with latest stock info
        res.status(200).json({
            transactionId: product.lastTransactionId,
            version: product.version,
            amount: product.amount
        });

    } catch (error: any) {
        console.error("Error in GetInventoryController:", error.message);
        res.status(404).json({ error: "Product not found" });
    }
}
