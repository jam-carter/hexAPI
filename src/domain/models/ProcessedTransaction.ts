interface AmountResponse {
    transactionId: string;
    version: number;
    amount: number;
}

interface CoinsResponse {
    transactionId: string;
    version: number;
    coins: number;
}

export type TransactionResponse = AmountResponse | CoinsResponse;

export interface IProcessedTransaction {
    transactionId: string;
    type: "purchase" | "stock";
    response: TransactionResponse;
}
