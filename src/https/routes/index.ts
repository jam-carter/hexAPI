import { Router } from "express";
import addStockRoute from "./AddStockRoute.js";
import { getInventoryRoute } from "./GetInventoryRoute.js";
import { purchaseStockRoute } from "./PurchaseStockRoute.js";
import eventViewerRoute from "./EventViewerRoute.js";

const router = Router();

router.use("/store", addStockRoute);
router.get("/store/:sku", getInventoryRoute);
router.post("/store/:sku/purchase", purchaseStockRoute);

if (process.env.NODE_ENV !== 'production') {
    router.use('/event-viewer', eventViewerRoute);
}

export default router;
