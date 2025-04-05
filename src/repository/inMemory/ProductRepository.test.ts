import { ProductRepository } from "./ProductRepository";

describe("ProductRepository", () => {
    let repo: ProductRepository;

    beforeEach(() => {
        repo = new ProductRepository();
    });

    it("adds new product stock and returns expected result", async () => {
        const result = await repo.addStock("sku-123", 10, "tx-001");

        expect(result).toEqual({
            isNew: true,
            isDuplicate: false,
            product: {
                sku: "sku-123",
                amount: 10,
                version: 1,
                lastTransactionId: "tx-001"
            }
        });

    });

    it("returns duplicate message for same transaction", async () => {
        await repo.addStock("sku-123", 10, "tx-002");
        const duplicate = await repo.addStock("sku-123", 10, "tx-002");

        expect(duplicate.isDuplicate).toBe(true);
    });

    it("increments version for new stock transactions", async () => {
        await repo.addStock("sku-123", 10, "tx-003");
        const second = await repo.addStock("sku-123", 20, "tx-004");

        expect(second.product.version).toBe(4);
        expect(second.product.amount).toBe(50);
    });

    it("throws error if amount is not valid", async () => {
        await expect(repo.addStock("sku-123", -5, "tx-005")).rejects.toThrow(
            "Invalid amount"
        );
    });

    it("clears all data with clearAll", async () => {
        await repo.addStock("sku-abc", 5, "tx-abc");
        await repo.clearAll();

        const result = await repo.addStock("sku-abc", 5, "tx-new");
        expect(result.product.version).toBe(1);
        expect(result.isNew).toBe(true);
    });
});
