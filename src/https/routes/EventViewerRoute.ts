import { Router, Response, Request } from "express";
import { sharedEventStore } from "../../config/dependencies.js";

const router = Router();

router.get("/event-viewer/:sku", (req: Request, res: Response): void => {
    const sku = req.params.sku;
    const events = sharedEventStore.getEventsForSKU(sku);

    if (!events.length) {
        res.status(404).json({ message: `No events found for SKU '${sku}'` });
        return
    }

    const sorted = [...events].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    res.json({
        sku,
        count: sorted.length,
        history: sorted
    });
});

export default router;
