import { ProductRepository } from "../../infrastructure/database/ProductRepository";
import { IProduct } from "../../domain/entities/product";

// Use case for adding stock to a product
export class AddStock {
    constructor(private productRepo: ProductRepository = new ProductRepository()) {}

    async execute(sku: string, amount: number, transactionId: string): Promise<{ product: IProduct; isNew: boolean }> {
        console.log(`AddStock: transactionId=${sku}, amount=${amount}`);

        if (!sku || typeof sku !== "string") {
            throw new Error("TransactionId is missing or invalid.");
        }

        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            throw new Error(`Invalid amount provided: ${amount}`);
        }

        return this.productRepo.addStock(sku, amount, transactionId);
    }
}
