import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { config, isDevelopment, isTest } from "./config";
import { connectDatabase, disconnectDatabase } from "./database";
import { errorHandler } from "./errorHandler";

function createServer(): FastifyInstance {
  const server = Fastify({
    logger: isTest
      ? false
      : {
          level: config.LOG_LEVEL,
          transport: isDevelopment
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  translateTime: "HH:MM:ss Z",
                  ignore: "pid,hostname",
                },
              }
            : undefined,
        },
  });

  // Register error handler
  server.setErrorHandler(errorHandler);

  // Register CORS
  server.register(cors, {
    origin: true,
  });

  // Health check endpoint
  server.get("/health", async () => {
    const version = process.env.npm_package_version || "0.1.0";
    return {
      ok: true,
      version,
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      uptime: process.uptime(),
    };
  });

  return server;
}

// Create server instance
const server = createServer();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await server.close();
    await disconnectDatabase();
    server.log.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    server.log.error(error, "Error during graceful shutdown");
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const start = async () => {
  try {
    // Connect to database only in non-test environments
    if (!isTest) {
      await connectDatabase();
    }

    // Start server
    await server.listen({
      port: config.PORT,
      host: config.HOST,
    });

    server.log.info(`Server listening on http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  start();
}

export { server, createServer };
export default server;
