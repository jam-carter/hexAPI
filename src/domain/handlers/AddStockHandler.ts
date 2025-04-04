import type { AddStockCommand } from "../commands/AddStockCommand";
import type { IProduct } from "../models/product";
import { ProductRepository } from "../../repository/inMemory/ProductRepository";

// just the methods this handler needs
export interface AddStockPort {
    addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }>;
}

// handler depends on the port interface
export class AddStockHandler {
    constructor(private productRepo: AddStockPort = new ProductRepository()) {}

    async execute(command: AddStockCommand) {
        return this.productRepo.addStock(command.sku, command.amount, command.transactionId);
    }
}
