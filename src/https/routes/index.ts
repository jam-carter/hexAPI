import { Router } from "express";
import { addStockRoute } from "./AddStockRoute";

const router = Router();

router.post("/store/:sku/stock", addStockRoute);

router.post("/add-stock", addStockRoute);

export default router;
