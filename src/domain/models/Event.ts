export type EventType = "StockAdded" | "ItemPurchased";

export interface BaseEvent {
    type: EventType;
    sku: string;
    transactionId: string;
    amount: number;
    timestamp: string;
}

export type StockAddedEvent = BaseEvent & { type: "StockAdded" };
export type ItemPurchasedEvent = BaseEvent & { type: "ItemPurchased" };

export type Event = StockAddedEvent | ItemPurchasedEvent;
