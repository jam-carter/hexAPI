import { AddStock } from "../../../src/application/use-cases/AddStock";
import { ProductRepository } from "../../../src/infrastructure/database/ProductRepository";

jest.mock("../../../src/infrastructure/database/ProductRepository");

describe("AddStock Use Case", () => {
    const mockAddStock = jest.fn();

    beforeEach(() => {
        // Reset the mock and assign it to the repository
        (ProductRepository as jest.Mock).mockImplementation(() => ({
            addStock: mockAddStock,
        }));
    });

    it("Throws an error for invalid sku", async () => {
        const useCase = new AddStock();
        await expect(
            useCase.execute("", 10, "tx123")
        ).rejects.toThrow("TransactionId is missing or invalid.");
    });

    it("Throws an error for invalid amount", async () => {
        const useCase = new AddStock();
        await expect(
            useCase.execute("sku123", -5, "tx123")
        ).rejects.toThrow("Invalid amount provided: -5");
    });

    it("Calls addStock with valid input", async () => {
        const useCase = new AddStock();
        const result = { product: { sku: "sku123", amount: 10, version: 1, lastTransactionId: "tx123" }, isNew: true };

        mockAddStock.mockResolvedValueOnce(result);

        const output = await useCase.execute("sku123", 10, "tx123");

        expect(mockAddStock).toHaveBeenCalledWith("sku123", 10, "tx123");
        expect(output).toEqual(result);
    });
});
