import request from "supertest";
import express from "express";
import { addStockRoute } from "./AddStockRoute";
import { ProductRepository } from "../../repository/inMemory/ProductRepository";

const app = express();
app.use(express.json());
app.post("/store/:sku/stock", addStockRoute);

describe("addStockRoute", () => {
    const repo = new ProductRepository();

    beforeEach(async () => {
        await repo.clearAll(); // reset state before each test
    });

    it("returns 201 for new stock addition", async () => {
        const response = await request(app)
            .post("/store/shirt-123/stock")
            .send({
                transactionId: "tx-add-1",
                amount: 10,
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            transactionId: "tx-add-1",
            version: 1,
            amount: 10,
            message: "Stock added",
        });
    });

    it("returns 202 for duplicate stock transaction", async () => {
        const data = {
            transactionId: "tx-add-dup",
            amount: 5,
        };

        // first call creates the product
        await request(app).post("/store/pen-111/stock").send(data);

        // second call with same transaction ID (should trigger idempotency)
        const response = await request(app)
            .post("/store/pen-111/stock")
            .send(data);

        expect(response.status).toBe(202);
        expect(response.body.message).toBe("Duplicate stock transaction");
    });

    it("returns 400 for invalid amount", async () => {
        const response = await request(app)
            .post("/store/bad-amount/stock")
            .send({
                transactionId: "bad-tx",
                amount: -5,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
