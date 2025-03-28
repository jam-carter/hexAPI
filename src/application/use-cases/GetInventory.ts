import { ProductRepository } from "../../infrastructure/database/ProductRepository";
import { IProduct } from "../../domain/entities/product";

const productRepo = new ProductRepository();

// Use case for retrieving current inventory of a product
export class GetInventory {
    async execute(transactionId: string): Promise<IProduct> {
        const product = await productRepo.getProduct(transactionId);

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }
}

