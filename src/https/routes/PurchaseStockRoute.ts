import type { Request, Response } from "express";
import { z } from "zod";
import { InventoryHandler } from "../../domain/handlers/InventoryHandler";

const SchemaWithCoins = z.object({
    sku: z.string(),
    coins: z.number().positive(),
    transactionId: z.string().min(1),
});

const SchemaWithAmount = z.object({
    sku: z.string(),
    amount: z.number().positive(),
    transactionId: z.string().min(1),
});

const handler = new InventoryHandler();

export const purchaseStockRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sku = req.params.sku;
    const isCoins = "coins" in req.body;
    const schema = isCoins ? SchemaWithCoins : SchemaWithAmount;

    const result = schema.safeParse({ ...req.body, sku });

    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }

    const command = result.data;

    try {
        const { product, isDuplicate } = await handler.execute({
            sku: command.sku,
            transactionId: command.transactionId,
            amount: isCoins ? (command as z.infer<typeof SchemaWithCoins>).coins : (command as z.infer<typeof SchemaWithAmount>).amount,
        });

        const statusCode = isDuplicate ? 202 : 201;

        res.status(statusCode).json({
            transactionId: command.transactionId,
            version: product.version,
            ...(isCoins ? { coins: product.amount } : { amount: product.amount }),
            message: isDuplicate ? "Duplicate purchase transaction" : "Purchase successful",
        });
    } catch (err: any) {
        console.error("purchase error:", err.message);
        res.status(400).json({ error: err.message });
    }
};
