import { ProductRepository } from "../../repository/inMemory/ProductRepository.js";
export class PurchaseStockHandler {
    productRepo;
    constructor(productRepo = new ProductRepository()) {
        this.productRepo = productRepo;
    }
    async execute(command) {
        const { sku, amount, coins, transactionId } = command;
        const value = amount ?? coins;
        const existingTxn = await this.productRepo.getProcessedTransaction(transactionId);
        if (existingTxn) {
            const product = await this.productRepo.getProduct(sku);
            if (!product)
                throw new Error(`Product with SKU '${sku}' not found`);
            return {
                product: {
                    ...product,
                    amount: "amount" in existingTxn.response
                        ? existingTxn.response.amount
                        : existingTxn.response.coins,
                },
                isNew: false,
                isDuplicate: true
            };
        }
        const product = await this.productRepo.getProduct(sku);
        if (!product)
            throw new Error(`Product with SKU '${sku}' not found`);
        if (product.amount < value)
            throw new Error("Not enough stock");
        product.amount -= value;
        product.version += 1;
        product.lastTransactionId = transactionId;
        await this.productRepo.saveProduct(product);
        await this.productRepo.saveProcessedTransaction({
            transactionId,
            type: "purchase",
            response: {
                transactionId,
                version: product.version,
                coins: value,
            }
        });
        return {
            product,
            isNew: false,
            isDuplicate: false
        };
    }
}
