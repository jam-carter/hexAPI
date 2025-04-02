import { IProduct } from "../../domain/models/Product";
import { IProcessedTransaction } from "../../domain/models/ProcessedTransaction";

// stores everything in memory
const products = new Map<string, IProduct>();
const processed = new Map<string, IProcessedTransaction>();

export class ProductRepository {
    // find a product by sku
    async getProduct(sku: string): Promise<IProduct | null> {
        return products.get(sku) ?? null;
    }

    // add stock (with idempotency check)
    async addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        // check if txn already happened
        const existing = processed.get(transactionId);
        if (existing && existing.type === "stock") {
            return {
                product: {
                    sku,
                    amount: existing.response.amount ?? 0,
                    version: existing.response.version,
                    lastTransactionId: transactionId,
                },
                isNew: false,
                isDuplicate: true,
            };
        }

        const existingProduct = products.get(sku);
        const isNew = !existingProduct;

        const product: IProduct = existingProduct
            ? {
                ...existingProduct,
                amount: existingProduct.amount + amount,
                version: existingProduct.version + 1,
                lastTransactionId: transactionId,
            }
            : {
                sku,
                amount,
                version: 1,
                lastTransactionId: transactionId,
            };

        // save to pretend DB
        products.set(sku, product);

        // record the txn so we don’t run it again
        processed.set(transactionId, {
            transactionId,
            type: "stock",
            response: {
                transactionId,
                version: product.version,
                amount: product.amount,
            },
        });

        return { product, isNew, isDuplicate: false };
    }
}
