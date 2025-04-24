import type { Event } from "../models/Event"

export interface ProductState {
    version: number;
    stockCount: number;
}

export function updateState(currentState: ProductState, event: Event): ProductState {
    switch (event.type) {
        case "StockAdded":
            return {
                version: currentState.version + 1,
                stockCount: currentState.stockCount + event.amount,
            };
        case "ItemPurchased":
            return {
                version: currentState.version + 1,
                stockCount: currentState.stockCount - event.amount,
            };
        default:
            return currentState;
    }
}
