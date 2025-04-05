import type { PurchaseCommand } from "../commands/PurchaseCommand";
import type { IProduct } from "../models/product";
import { ProductRepository } from "../../repository/inMemory/ProductRepository";

export class PurchaseStockHandler {
    constructor(private productRepo: ProductRepository = new ProductRepository()) {}

    async execute(command: PurchaseCommand): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        const { sku, amount, coins, transactionId } = command;
        const value = amount ?? coins!;

        const existingTxn = await this.productRepo.getProcessedTransaction(transactionId);
        if (existingTxn) {
            const product = await this.productRepo.getProduct(sku);
            if (!product) throw new Error(`Product with SKU '${sku}' not found`);

            return {
                product: {
                    ...product,
                    amount: "amount" in existingTxn.response
                        ? existingTxn.response.amount
                        : existingTxn.response.coins,
                    version: existingTxn.response.version,
                },
                isNew: false,
                isDuplicate: true
            };
        }

        const product = await this.productRepo.getProduct(sku);
        if (!product) throw new Error(`Product with SKU '${sku}' not found`);
        if (product.amount < value) throw new Error("Not enough stock");

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
                coins: product.amount, // Store current amount left
            }
        });

        return {
            product,
            isNew: false,
            isDuplicate: false
        };
    }
}
