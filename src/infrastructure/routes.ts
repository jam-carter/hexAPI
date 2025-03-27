import { Router } from "express";
import { addStockController } from "./controllers/AddStockController";
import { getInventoryController } from "./controllers/GetInventoryController";
import { purchaseController } from "./controllers/PurchaseController";

const router = Router();

router.post("/store/:sku/stock", addStockController);
router.get("/store/:sku", getInventoryController);
router.post("/store/:sku/purchase", purchaseController);


export default router;
