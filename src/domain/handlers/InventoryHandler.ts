import type { EventStore } from "../../repository/inMemory/EventStore";
import { replayLedger } from "../services/Ledger.js";
import type { Event } from "../models/Event";

export class InventoryHandler {
    constructor(private eventStore: EventStore) {}

    // Used by POST /store/:sku/stock
    async execute({
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
        isDuplicate: boolean;
    }> {
        const isDuplicate = this.eventStore.hasTransaction(transactionId);

        if (!isDuplicate) {
            const newEvent: Event = {
                type: "StockAdded",
                sku,
                amount,
                transactionId,
                timestamp: new Date().toISOString(),
            };
            this.eventStore.append(newEvent);
            console.log("Event Ledger:", this.eventStore.getAllEvents());
        }

        const currentEvents = this.eventStore.getEventsForSKU(sku);
        const productState = replayLedger(currentEvents);
        return {
            transactionId: transactionId,
            version: productState.version,
            amount: productState.amount,
            isDuplicate,
        };
    }

    // Used by GET /store/:sku
    get(sku: string): { transactionId: string; version: number; amount: number } | undefined {
        const events = this.eventStore.getEventsForSKU(sku);
        if (!events.length) return undefined;

        return replayLedger(events);
    }

    // Used by POST /store/:sku/purchase
    async purchase({
                       sku,
                       amount,
                       transactionId,
                   }: {
        sku: string;
        amount: number;
        transactionId: string;
    }): Promise<
        | { transactionId: string; version: number; coins: number; isDuplicate: true }
        | { transactionId: string; version: number; coins: number; isDuplicate: false }
    > {
        const isDuplicate = this.eventStore.hasTransaction(transactionId);

        if (isDuplicate) {
            const existingEvent = this.eventStore.getEventByTransactionId(transactionId)!;
            const events = this.eventStore.getEventsForSKU(sku);
            const state = replayLedger(events);

            return {
                transactionId: existingEvent.transactionId,
                version: state.version,
                coins: state.amount,
                isDuplicate: true,
            };
        }

        const events = this.eventStore.getEventsForSKU(sku);
        const state = replayLedger(events);

        if (amount > state.amount) {
            throw new Error("Not enough inventory");
        }

        const newEvent: Event = {
            type: "ItemPurchased",
            sku,
            amount,
            transactionId,
            timestamp: new Date().toISOString(),
        };
        this.eventStore.append(newEvent);
        console.log("Event Ledger:", this.eventStore.getAllEvents());

        const updatedEvents = this.eventStore.getEventsForSKU(sku);
        const newState = replayLedger(updatedEvents);

        return {
            transactionId,
            version: newState.version,
            coins: newState.amount,
            isDuplicate: false,
        };
    }
}
