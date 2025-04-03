import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
// checklist; what env vars we require, and what types they should be
const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
    NODE_ENV: z.enum(["development", "production"]).optional(),
});
// parse and validate
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    process.exit(1); // stop early so we don’t run in a bad state
}
// if validation good we export the safe values
export const env = result.data;
