import { GetInventoryHandler } from "../../domain/handlers/GetInventoryHandler.js";
const handler = new GetInventoryHandler();
export const getInventoryRoute = async (req, res) => {
    const sku = req.params.sku;
    try {
        const product = await handler.execute(sku);
        res.status(200).json({
            sku: product.sku,
            amount: product.amount,
            version: product.version,
            transactionId: product.lastTransactionId
        });
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
};
