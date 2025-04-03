export interface PurchaseCommand {
    sku: string,
    amount? : number;
    coins? : number;
    transactionId: string;
}