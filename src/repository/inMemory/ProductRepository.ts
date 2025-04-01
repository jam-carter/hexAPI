import { Product, IProduct } from "../../domain/models/product";
import { ProcessedTransaction } from "../../domain/models/ProcessedTransaction";

export class ProductRepository {

    //w/removal of mongo we rewrite; use a map that lives in memory
    async getProduct(sku: string): Promise<IProduct | null> {
        return Product.findOne({ sku });
    }

    //Adds stock to product
    async addStock(sku: string, amount: number, transactionId: string): Promise<{
        product: IProduct;
        isNew: boolean;
        isDuplicate: boolean;
    }> {
        // validation checks can be removed for v2, instead move them ro the route file and use zod
        // afterwards this function simply assumes information is correct
        if (!sku.trim()) throw new Error("SKU is missing or invalid.");
        if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Invalid amount provided: ${amount}`);
        if (!transactionId.trim()) throw new Error("TransactionId is missing or invalid.");

        // currently uses mongo, will need to change to a set/map instead w/inMem
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

        // will be changed to finding/creating w/map
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

        //updates map value in v2
        await product.save();

        //use a set or map in v2
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

    // re-write to clean our map inMem
    async clearAll(): Promise<void> {
        await Product.deleteMany({});
    }
}

//map allows very quickly access -- store product data
//set wont let us have the same thing twice -- track used transactions