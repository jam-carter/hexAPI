import { ProductRepository } from "../../infrastructure/database/ProductRepository";
import { IProduct } from "../../domain/entities/Product";

const productRepo = new ProductRepository();

// Use case for adding stock to a product
export class AddStock {
    async execute(sku: string, amount: number, transactionId: string): Promise<{ product: IProduct; isNew: boolean }> {
        console.log("AddStock: transactionId=${sku}, amount=${amount}");

        // Basic input validation
        if (!sku || typeof sku !== "string") {
            throw new Error("TransactionId is missing or invalid.");
        }

        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount provided: ${amount}");
        }

        // Delegate to repository logic
        return productRepo.addStock(sku, amount, transactionId);
    }
}

