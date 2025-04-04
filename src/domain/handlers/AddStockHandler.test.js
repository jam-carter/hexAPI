import { AddStockHandler, AddStockPort } from "./AddStockHandler.js";
import { AddStockCommand } from "../commands/AddStockCommand.js";
describe("AddStockHandler", () => {
    let fakeRepo;
    let handler;
    beforeEach(() => {
        fakeRepo = {
            addStock: jest.fn().mockResolvedValue({
                product: { sku: "123", amount: 150, version: 2 },
                isNew: false,
                isDuplicate: false,
            }),
        };
        handler = new AddStockHandler(fakeRepo);
    });
    it("should add stock correctly", async () => {
        const command = {
            sku: "123",
            amount: 50,
            transactionId: "tx123",
        };
        const result = await handler.execute(command);
        expect(result.product.amount).toBe(150);
        expect(fakeRepo.addStock.mock.calls.length).toBe(1);
    });
});
