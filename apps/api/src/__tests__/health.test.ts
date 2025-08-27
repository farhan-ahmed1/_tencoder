import { createServer } from "../server";
import { FastifyInstance } from "fastify";

describe("Health Endpoint", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = createServer();
    await server.ready();
  }, 20000);

  afterAll(async () => {
    if (server) {
      await server.close();
    }
  }, 10000);

  describe("GET /health", () => {
    it("should return health status with ok: true and version", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);

      const body = JSON.parse(response.payload);

      expect(body).toMatchObject({
        ok: true,
        version: expect.any(String),
        timestamp: expect.any(String),
        environment: "test",
        uptime: expect.any(Number),
      });

      // Validate timestamp format (ISO string)
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);

      // Validate uptime is a positive number
      expect(body.uptime).toBeGreaterThan(0);
    });

    it("should return consistent response structure", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.payload);
      const requiredFields = [
        "ok",
        "version",
        "timestamp",
        "environment",
        "uptime",
      ];
      requiredFields.forEach(field => {
        expect(body).toHaveProperty(field);
      });
    });

    it("should return ok: true", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.payload);
      expect(body.ok).toBe(true);
    });
  });
});
