import { InventoryHandler } from "./InventoryHandler";
import { AddStockCommand } from "../commands/AddStockCommand";

describe("InventoryHandler.addStock", () => {
    let fakeRepo: { addStock: jest.Mock };
    let handler: InventoryHandler;

    beforeEach(() => {
        fakeRepo = {
            addStock: jest.fn().mockResolvedValue({
                product: { sku: "123", amount: 150, version: 2 },
                isNew: false,
                isDuplicate: false,
            }),
        };

        handler = new InventoryHandler(fakeRepo as any);
    });

    it("should add stock correctly", async () => {
        const command: AddStockCommand = {
            sku: "123",
            amount: 50,
            transactionId: "tx123",
        };

        const result = await handler.addStock(command);

        expect(result.product.amount).toBe(150);
        expect(fakeRepo.addStock).toHaveBeenCalledTimes(1);
    });
});
