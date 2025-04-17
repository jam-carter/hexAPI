import type { Event } from "../models/Event";

export function replayLedger(events: Event[]) {
    // sort oldest to newest
    const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let amount = 0;
    let version = 0;
    let lastTransactionId = "";

    for (const event of sorted) {
        if (event.type === "StockAdded") {
            amount += event.amount;
        } else if (event.type === "ItemPurchased") {
            amount -= event.amount;
        }
        version += 1;
        lastTransactionId = event.transactionId;
    }

    return {
        transactionId: lastTransactionId,
        version,
        amount
    };
}
