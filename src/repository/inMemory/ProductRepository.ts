import type { Product } from "../../domain/models/product";
import type { ProcessedTransaction } from "../../domain/models/ProcessedTransaction";

// in-memory store
const products = new Map<string, Product>();
const processedTransactions = new Map<string, ProcessedTransaction>();

export class ProductRepository {

    async addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: Product;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        if (processedTransactions.has(transactionId)) {
            const existing = processedTransactions.get(transactionId)!;
            const product = products.get(sku)!;

            const restoredAmount = "amount" in existing.response
                ? existing.response.amount
                : existing.response.coins;

            return {
                product: {
                    ...product,
                    amount: restoredAmount,
                    version: existing.response.version
                },
                isNew: false,
                isDuplicate: true
            };
        }

        let product = products.get(sku);
        const isNew = !product;

        if (!product) {
            product = {
                sku,
                amount,
                version: 1,
                lastTransactionId: transactionId
            };
        } else {
            product.amount += amount;
            product.version += 1;
            product.lastTransactionId = transactionId;
        }

        products.set(sku, product);

        processedTransactions.set(transactionId, {
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

    async clearAll(): Promise<void> {
        products.clear();
        processedTransactions.clear();
    }
}
