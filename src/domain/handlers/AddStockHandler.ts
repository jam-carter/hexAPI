import { ProductRepository } from "../../repository/inMemory/ProductRepository";
import { IProduct } from "../models/product";

// Use case for adding stock to a product
export class AddStockHandler {
    //atm creates own product repo, in v2 it should grab it from the outside, easier to test
    constructor(private productRepo: ProductRepository = new ProductRepository()) {}

    async execute(sku: string, amount: number, transactionId: string): Promise<{ product: IProduct; isNew: boolean }> {
        console.log(`AddStock: transactionId=${sku}, amount=${amount}`);

        //will do these checks earlier in route file w/zod; removes muddle from business logic
        if (!sku || typeof sku !== "string") {
            throw new Error("TransactionId is missing or invalid.");
        }

        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            throw new Error(`Invalid amount provided: ${amount}`);
        }

        //change this so the handler can tell if it's a dupe ? ; states explicitly
        return this.productRepo.addStock(sku, amount, transactionId);
    }
}
