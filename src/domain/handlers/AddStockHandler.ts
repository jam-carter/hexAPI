import { AddStockCommand } from "../commands/AddStockCommand";
import { IProduct } from "../models/Product";
import { ProductRepository } from "../../repository/inMemory/ProductRepository";

// handles the logic for adding stock
export class AddStockHandler {
    constructor(private productRepo: ProductRepository = new ProductRepository()) {}

    async execute(command: AddStockCommand): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        // assumes validation already happened at the route layer

        // forward to repo to handle add stock + idempotency
        return this.productRepo.addStock(command.sku, command.amount, command.transactionId);
    }
}
