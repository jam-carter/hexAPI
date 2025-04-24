import type { Event } from "../../domain/models/Event";
import type { ProductState } from "../../domain/services/Ledger";
import { updateState } from "../../domain/services/Ledger";

export interface EventStore {
    saveTransactions(events: Event[]): void;
    loadLatestState(sku: string): ProductState;
}

export class InMemoryEventStore implements EventStore {
    private events: Event[] = [];
    private states: Record<string, ProductState> = {};
    private transactionsSeen: Set<string> = new Set();

    saveTransactions(events: Event[]): void {
        for (const event of events) {
            if (this.transactionsSeen.has(event.transactionId)) {
                throw new Error(`Duplicate transactionId: ${event.transactionId}`);
            }

            const currentState = this.states[event.sku] || { version: 0, stockCount: 0 };
            const updatedState = updateState(currentState, event);

            this.states[event.sku] = updatedState;
            this.events.push(event);
            this.transactionsSeen.add(event.transactionId);
        }
    }

    loadLatestState(sku: string): ProductState {
        return this.states[sku] || { version: 0, stockCount: 0 };
    }
    getEventsForSKU(sku: string): Event[] {
        return this.events.filter(event => event.sku === sku);
    }
}
