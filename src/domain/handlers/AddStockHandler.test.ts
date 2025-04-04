import type { AddStockPort } from "./AddStockHandler";
import type { AddStockCommand } from "../commands/AddStockCommand";
import { AddStockHandler, } from "./AddStockHandler";

describe("AddStockHandler", () => {
    let fakeRepo: AddStockPort;
    let handler: AddStockHandler;

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
        const command: AddStockCommand = {
            sku: "123",
            amount: 50,
            transactionId: "tx123",
        };

        const result = await handler.execute(command);

        expect(result.product.amount).toBe(150);
        expect((fakeRepo.addStock as jest.Mock).mock.calls.length).toBe(1);
    });
});
