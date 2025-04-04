import type { Request, Response } from "express";
import  { AddStockHandler } from "../../domain/handlers/AddStockHandler";
import  { z } from "zod";

const AddStockSchema = z.object({
    sku: z.string(),
    amount: z.number().positive(),
    transactionId: z.string().min(1),
});

const handler = new AddStockHandler();

export const addStockRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sku = req.params.sku;
    const result = AddStockSchema.safeParse({ ...req.body, sku });

    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }

    const command = result.data;

    try {
        const { product, isNew, isDuplicate } = await handler.execute(command);

        const statusCode = isDuplicate ? 202 : isNew ? 201 : 200;

        res.status(statusCode).json({
            transactionId: command.transactionId,
            version: product.version,
            amount: product.amount,
            message: isDuplicate ? "Duplicate stock transaction" : "Stock added",
        });
    } catch (err: any) {
        console.error("addStock error:", err.message);
        res.status(500).json({ error: err.message });
    }
};
