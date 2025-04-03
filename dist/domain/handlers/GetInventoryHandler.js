import { ProductRepository } from "../../repository/inMemory/ProductRepository.js";
const productRepo = new ProductRepository();
// Use case for retrieving current inventory of a product
export class GetInventoryHandler {
    async execute(transactionId) {
        const product = await productRepo.getProduct(transactionId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
}
