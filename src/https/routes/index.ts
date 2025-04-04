import { Router } from "express";
import { addStockRoute } from "./AddStockRoute";
import { getInventoryRoute } from "./GetInventoryRoute";
import { purchaseStockRoute } from "./PurchaseStockRoute";

const router = Router();

router.post("/store/:sku/stock", addStockRoute);
router.get("/store/:sku", getInventoryRoute);
router.post("/store/:sku/purchase", purchaseStockRoute);

router.post("/add-stock", addStockRoute);

export default router;
