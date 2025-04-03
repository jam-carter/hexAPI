// in-memory store
const products = new Map();
const processedTransactions = new Map();
export class ProductRepository {
    async getProduct(sku) {
        return products.get(sku) || null;
    }
    async addStock(sku, amount, transactionId) {
        if (processedTransactions.has(transactionId)) {
            const existing = processedTransactions.get(transactionId);
            const product = products.get(sku);
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
        }
        else {
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
    async getProcessedTransaction(transactionId) {
        return processedTransactions.get(transactionId);
    }
    async saveProduct(product) {
        products.set(product.sku, product);
    }
    async saveProcessedTransaction(txn) {
        processedTransactions.set(txn.transactionId, txn);
    }
    async clearAll() {
        products.clear();
        processedTransactions.clear();
    }
}
