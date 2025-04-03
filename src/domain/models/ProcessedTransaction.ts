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

const responseSchema = new Schema(
    {
        transactionId: { type: String, required: true },
        version: { type: Number, required: true },
        coins: Number,
        amount: Number
    },
    { _id: false }
);

const processedTransactionSchema = new Schema({
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["purchase", "stock"], required: true },
    response: { type: responseSchema, required: true }
});

export const ProcessedTransaction =
    models.ProcessedTransaction ?? model("ProcessedTransaction", processedTransactionSchema);
