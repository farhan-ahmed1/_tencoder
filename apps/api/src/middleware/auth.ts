import { FastifyRequest } from "fastify";

export interface AuthenticatedRequest extends FastifyRequest {
  userId?: string;
}

export async function extractUserIdFromSession(
  request: FastifyRequest
): Promise<string | null> {
  // For now, we'll use a simple header-based approach
  // In production, you'd validate the session token here
  const userId = request.headers["x-user-id"] as string;

  if (userId) {
    return userId;
  }

  // Fallback to mock user ID for development
  return "cmeudtu8s00005gl4afdqtz8c";
}
