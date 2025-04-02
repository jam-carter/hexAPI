// this is just a typed object that tells us what the request wants to do
// we’ll pass it into the handler to do the real work

export interface AddStockCommand {
    sku: string;
    amount: number;
    transactionId: string;
}

