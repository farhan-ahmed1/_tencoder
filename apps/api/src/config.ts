import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

type Config = z.infer<typeof envSchema>;

export const config: Config = envSchema.parse(process.env);

export const isDevelopment = config.NODE_ENV === "development";
export const isProduction = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";
