import { z } from "zod";

export const PurchaseSchema = z.object({
    sku: z.string().min(1),
    transactionId: z.string().min(1),
    amount: z.number().positive().optional(),
    coins: z.number().positive().optional(),
}).refine(data => data.amount !== undefined || data.coins !== undefined, {
    message: "Either amount or coins must be provided",
});

export type PurchaseCommand = z.infer<typeof PurchaseSchema>;

export function validatePurchaseCommand(input: unknown): PurchaseCommand {
    const result = PurchaseSchema.safeParse(input);
    if (!result.success) throw new Error("Invalid PurchaseCommand");
    return result.data;
}
