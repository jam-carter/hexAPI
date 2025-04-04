import type { IProduct } from "../../domain/models/product";
import type { IProcessedTransaction } from "../../domain/models/ProcessedTransaction";

// in-memory store
const products = new Map<string, IProduct>();
const processedTransactions = new Map<string, IProcessedTransaction>();

export class ProductRepository {
    async getProduct(sku: string): Promise<IProduct | null> {
        return products.get(sku) || null;
    }

    async addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
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

    async getProcessedTransaction(transactionId: string): Promise<IProcessedTransaction | undefined> {
        return processedTransactions.get(transactionId);
    }

    async saveProduct(product: IProduct): Promise<void> {
        products.set(product.sku, product);
    }

    async saveProcessedTransaction(txn: IProcessedTransaction): Promise<void> {
        processedTransactions.set(txn.transactionId, txn);
    }

    async clearAll(): Promise<void> {
        products.clear();
        processedTransactions.clear();
    }
}
