import { z } from "zod";

export const AddStockSchema = z.object({
    sku: z.string().min(1),
    amount: z.number().positive(),
    transactionId: z.string().min(1),
});

export type AddStockCommand = z.infer<typeof AddStockSchema>;

export function validateAddStockCommand(input: unknown): AddStockCommand {
    const result = AddStockSchema.safeParse(input);
    if (!result.success) throw new Error("Invalid AddStockCommand");
    return result.data;
}
