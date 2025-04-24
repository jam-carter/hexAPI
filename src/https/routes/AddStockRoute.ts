import { Router, Response, Request } from "express";
import { InventoryHandler } from "../../domain/handlers/InventoryHandler.js";
import { sharedEventStore } from "../../config/dependencies.js";
import { z } from "zod";

const router = Router();
const handler = new InventoryHandler(sharedEventStore);

const AddStockSchema = z.object({
    amount: z.number().positive(),
    transactionId: z.string().min(1),
});

router.post("/:sku/stock", async (req: Request, res: Response ): Promise<void> => {
    const sku = req.params.sku;
    const parsed = AddStockSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ message: "Invalid stock data" });
        return
    }

    const { amount, transactionId } = parsed.data;

    try {
        const responseBody = await handler.handleAddStock({sku, amount, transactionId});
        const status = 201;

        res.status(status).json(responseBody);
        return
    } catch (err) {
        console.error("Failed to add stock:", err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
});

export default router;
