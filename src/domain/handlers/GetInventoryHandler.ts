import { ProductRepository } from "../../repository/inMemory/ProductRepository";
import type { IProduct } from "../models/product";

const productRepo = new ProductRepository();

// Use case for retrieving current inventory of a product
export class GetInventoryHandler {
    async execute(transactionId: string): Promise<IProduct> {
        const product = await productRepo.getProduct(transactionId);

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }
}

