import { ProductRepository } from "../../repository/inMemory/ProductRepository";
// handler depends on the port interface
export class AddStockHandler {
    productRepo;
    constructor(productRepo = new ProductRepository()) {
        this.productRepo = productRepo;
    }
    async execute(command) {
        return this.productRepo.addStock(command.sku, command.amount, command.transactionId);
    }
}
