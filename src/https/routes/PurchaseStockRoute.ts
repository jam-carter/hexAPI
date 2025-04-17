import type { Request, Response } from "express";
import { z } from "zod";
import { InventoryHandler } from "../../domain/handlers/InventoryHandler.js";
import { sharedEventStore } from "../../config/dependencies.js";

const handler = new InventoryHandler(sharedEventStore);

const PurchaseSchema = z.object({
    transactionId: z.string().min(1),
    amount: z.number().positive().or(z.undefined()), // allow either `amount` or `coins`
    coins: z.number().positive().or(z.undefined())
});

export const purchaseStockRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sku = req.params.sku;

    const parsed = PurchaseSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return
    }

    const { transactionId, amount, coins } = parsed.data;
    const value = amount ?? coins!;

    try {
        const result = await handler.purchase({ sku, transactionId, amount: value });

        const status = result.isDuplicate ? 202 : 201;
        res.status(status).json({
            transactionId: result.transactionId,
            version: result.version,
            coins: result.coins
        });
    } catch (err: any) {
        console.error("purchase error:", err.message);
        res.status(400).json({ error: err.message });
    }
};
