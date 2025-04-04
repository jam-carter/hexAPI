import type { Request, Response } from "express";
import { GetInventoryHandler } from "../../domain/handlers/GetInventoryHandler";

const handler = new GetInventoryHandler();

export const getInventoryRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sku = req.params.sku;

    try {
        const product = await handler.execute(sku);

        res.status(200).json({
            sku: product.sku,
            amount: product.amount,
            version: product.version,
            transactionId: product.lastTransactionId
        });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};
