import { ProductRepository } from "../../infrastructure/database/ProductRepository";
import { IProduct } from "../../domain/entities/product";
import { ProcessedTransaction } from "../../domain/entities/ProcessedTransaction";

const productRepo = new ProductRepository();

// Use case for purchasing stock from a product
export class PurchaseStock {
    async execute(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
        isDuplicate: boolean;
    }> {
        // Validate inputs
        if (!sku || !transactionId || amount <= 0) {
            throw new Error("Invalid input");
        }

        // Check for duplicate transaction
        const existing = await ProcessedTransaction.findOne({ transactionId });
        if (existing) {
            return {
                product: {
                    sku,
                    amount: existing.response.coins,
                    version: existing.response.version,
                    lastTransactionId: transactionId,
                    _id: "" // Dummy ID to satisfy interface
                } as IProduct,
                isDuplicate: true
            };
        }

        // Retrieve product and validate stock availability
        const product = await productRepo.getProduct(sku);
        if (!product) throw new Error("Product not found");
        if (product.amount < amount) throw new Error("Insufficient stock");

        // Deduct amount and update version
        product.amount -= amount;
        product.version += 1;
        product.lastTransactionId = transactionId;
        await product.save();

        // Save transaction to prevent duplicates
        await ProcessedTransaction.create({
            transactionId,
            type: "purchase",
            response: {
                transactionId,
                version: product.version,
                coins: product.amount
            }
        });

        return { product, isDuplicate: false };
    }
}
