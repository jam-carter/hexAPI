import { Router } from "express";
import addStockRoute from "./AddStockRoute.js";
import { getInventoryRoute } from "./GetInventoryRoute.js";
import { purchaseStockRoute } from "./PurchaseStockRoute.js";
import EventViewerRoute from "./EventViewerRoute.js";

const router = Router();

router.use("/store", addStockRoute);
router.get("/store/:sku", getInventoryRoute);
router.post("/store/:sku/purchase", purchaseStockRoute);

router.use(EventViewerRoute);

export default router;
