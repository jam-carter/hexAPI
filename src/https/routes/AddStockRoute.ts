import { Request, Response } from "express";
import { AddStockHandler } from "../../domain/handlers/AddStockHandler";
import { z } from "zod";

// checklist; make sure the request body is valid before we pass it to the handler
const AddStockSchema = z.object({
    sku: z.string(),
    amount: z.number().positive(),
    transactionId: z.string().min(1),
});

const handler = new AddStockHandler();

// this route handles post
export const addStockRoute = async (req: Request, res: Response): Promise<void> => {
    // validate request body
    const result = AddStockSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    const command = result.data;

    try {
        const { product, isNew, isDuplicate } = await handler.execute(command);

        const statusCode = isNew ? 201 : 202;

        res.status(statusCode).json({
            transactionId: command.transactionId,
            version: product.version,
            amount: product.amount,
            message: "Stock added",
            ...(isDuplicate && { message: "Duplicate stock transaction" }),
        });

    } catch (err: any) {
        console.error("addStock error:", err.message);
        res.status(500).json({ error: err.message });
    }
};
