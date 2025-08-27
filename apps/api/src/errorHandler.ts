import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { config } from "./config";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export class ValidationError extends Error implements AppError {
  statusCode = 400;
  code = "VALIDATION_ERROR";

  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = "NOT_FOUND";

  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export async function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Validation Error",
      message: "Invalid request data",
      details: error.errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle custom app errors
  if ("statusCode" in error && error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.name || "Application Error",
      message: error.message,
      code: (error as AppError).code,
      timestamp: new Date().toISOString(),
      ...(config.NODE_ENV === "development" && { stack: error.stack }),
    });
  }

  // Handle Fastify errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: "Request Error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle unknown errors
  request.log.error(error, "Unhandled error");

  return reply.status(500).send({
    error: "Internal Server Error",
    message:
      config.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : error.message,
    timestamp: new Date().toISOString(),
    ...(config.NODE_ENV === "development" && { stack: error.stack }),
  });
}
