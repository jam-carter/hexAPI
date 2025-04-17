import type { Request, Response } from "express";
import { InventoryHandler } from "../../domain/handlers/InventoryHandler.js";
import { sharedEventStore } from "../../config/dependencies.js";

const handler = new InventoryHandler(sharedEventStore);

export const getInventoryRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sku = req.params.sku;

    try {
        const product = handler.get(sku);

        if (!product) {
            res.status(404).json({ message: "SKU not found" });
            return
        }

        res.status(200).json({
            transactionId: product.transactionId,
            version: product.version,
            amount: product.amount
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
