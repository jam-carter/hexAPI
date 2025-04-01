import { Router } from "express";
import { addStockRoute } from "./AddStockRoute";
import { getInventoryRoute } from "./GetInventoryRoute";
import { purchaseRoute } from "./PurchaseRoute";

const router = Router();

router.post("/store/:sku/stock", addStockRoute);
router.get("/store/:sku", getInventoryRoute);
router.post("/store/:sku/purchase", purchaseRoute);

router.post("/add-stock", addStockRoute);

export default router;
