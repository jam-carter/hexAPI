import { ProductRepository } from "../../repository/inMemory/ProductRepository";
import type { Product } from "../models/product";

import { validateAddStockCommand } from "../commands/AddStockCommand";

export class InventoryHandler {
    constructor(private productRepo: ProductRepository = new ProductRepository()) {}

    async addStock(input: unknown): Promise<{
        product: Product;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        const command = validateAddStockCommand(input);
        return this.productRepo.addStock(command.sku, command.amount, command.transactionId);
    }

}
