import type { Event } from "../../domain/models/Event";

export class EventStore {
    private events: Map<string, Event[]> = new Map(); // key = sku

    append(event: Event): void {
        const skuEvents = this.events.get(event.sku) || [];
        skuEvents.push(event);
        this.events.set(event.sku, skuEvents);
    }

    getEventsForSKU(sku: string): Event[] {
        return this.events.get(sku) || [];
    }

    getAllEvents(): Event[] {
        return Array.from(this.events.values()).flat();
    }

    hasTransaction(transactionId: string): boolean {
        return this.getAllEvents().some((event) => event.transactionId === transactionId);
    }

    getEventByTransactionId(transactionId: string): Event | undefined {
        return this.getAllEvents().find((event) => event.transactionId === transactionId);
    }
}
