import { ProductRepository } from "../../repository/inMemory/ProductRepository.js";
// handles the logic for adding stock
export class AddStockHandler {
    productRepo;
    constructor(productRepo = new ProductRepository()) {
        this.productRepo = productRepo;
    }
    async execute(command) {
        // assumes validation already happened at the route layer
        // forward to repo to handle add stock + idempotency
        return this.productRepo.addStock(command.sku, command.amount, command.transactionId);
    }
}
