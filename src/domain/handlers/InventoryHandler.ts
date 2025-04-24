import type { EventStore } from "../../repository/inMemory/EventStore";
import type { Event } from "../models/Event";
import { AddStockSchema } from "../commands/AddStockCommand";
import { PurchaseSchema } from "../commands/PurchaseCommand";

export class InventoryHandler {
    constructor(private eventStore: EventStore) {}

    async handleAddStock({
                             sku,
                             amount,
                             transactionId,
                         }: {
        sku: string;
        amount: number;
        transactionId: string;
    }): Promise<{
        transactionId: string;
        version: number;
        amount: number;
    }> {
        const validationResult = AddStockSchema.safeParse({ sku, amount, transactionId });
        if (!validationResult.success) {
            throw new Error(`AddStockCommand validation failed: ${validationResult.error}`);
        }

        const newEvent: Event = {
            type: "StockAdded",
            sku,
            amount,
            transactionId,
            timestamp: new Date().toISOString(),
        };

        this.eventStore.saveTransactions([newEvent]);

        // ✅ NEW: use latest state, not replay
        const state = this.eventStore.loadLatestState(sku);

        return {
            transactionId,
            version: state.version,
            amount: state.stockCount,
        };
    }

    get(sku: string): { transactionId: string; version: number; amount: number } | undefined {
        const state = this.eventStore.loadLatestState(sku);
        if (!state) return undefined;

        return {
            transactionId: "latest", // optional: you could drop this if not used
            version: state.version,
            amount: state.stockCount,
        };
    }

    async handleMakePurchase({
                                 sku,
                                 amount,
                                 transactionId,
                             }: {
        sku: string;
        amount: number;
        transactionId: string;
    }): Promise<{
        transactionId: string;
        version: number;
        coins: number;
    }> {
        const validationResult = PurchaseSchema.safeParse({ sku, amount, transactionId });
        if (!validationResult.success) {
            throw new Error(`PurchaseCommand validation failed: ${validationResult.error}`);
        }

        const currentState = this.eventStore.loadLatestState(sku);

        if (amount > currentState.stockCount) {
            throw new Error("Not enough inventory");
        }

        const newEvent: Event = {
            type: "ItemPurchased",
            sku,
            amount,
            transactionId,
            timestamp: new Date().toISOString(),
        };

        this.eventStore.saveTransactions([newEvent]);

        const updatedState = this.eventStore.loadLatestState(sku);

        return {
            transactionId,
            version: updatedState.version,
            coins: updatedState.stockCount,
        };
    }
}
