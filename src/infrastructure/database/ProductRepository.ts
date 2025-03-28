import { Product, IProduct } from "../../domain/entities/product";
import { ProcessedTransaction } from "../../domain/entities/ProcessedTransaction";

/**
 * Handles product inventory and stock-related DB operations.
 */
export class ProductRepository {

    // Get a product by SKU
    async getProduct(sku: string): Promise<IProduct | null> {
        return Product.findOne({ sku });
    }

    /**
     * Adds stock to a product.
     * Uses transactionId for idempotency.
     */
    async addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        // Validate inputs
        if (!sku.trim()) throw new Error("SKU is missing or invalid.");
        if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Invalid amount provided: ${amount}`);
        if (!transactionId.trim()) throw new Error("TransactionId is missing or invalid.");

        // Check if this transaction was already processed
        const existing = await ProcessedTransaction.findOne({ transactionId, type: "stock" });
        if (existing) {
            return {
                product: {
                    sku,
                    amount: existing.response.amount,
                    version: existing.response.version,
                    lastTransactionId: transactionId,
                    _id: ""
                } as IProduct,
                isNew: false,
                isDuplicate: true
            };
        }

        // Create or update the product
        let product = await Product.findOne({ sku });
        const isNew = !product;

        if (!product) {
            product = new Product({ sku, amount, version: 1, lastTransactionId: transactionId });
            console.log(`New product created: ${sku}`);
        } else {
            product.amount += amount;
            product.version += 1;
            product.lastTransactionId = transactionId;
            console.log(`Updated stock for ${sku}: ${product.amount}`);
        }

        await product.save();

        // Save the processed transaction
        await ProcessedTransaction.create({
            transactionId,
            type: "stock",
            response: {
                transactionId,
                version: product.version,
                amount: product.amount
            }
        });

        return { product, isNew, isDuplicate: false };
    }

    // Clear all products (used for reset/testing)
    async clearAll(): Promise<void> {
        await Product.deleteMany({});
    }
}
