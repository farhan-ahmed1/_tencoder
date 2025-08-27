import { PrismaClient } from "@prisma/client";
import { config } from "./config";

export const prisma = new PrismaClient({
  log:
    config.LOG_LEVEL === "debug"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Failed to disconnect from database:", error);
    throw error;
  }
}
