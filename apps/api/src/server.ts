import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

// Register CORS
server.register(require("@fastify/cors"), {
  origin: true,
});

// Health check endpoint
server.get("/health", async () => {
  return { status: "ok", service: "_tencoder-api" };
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server listening on http://localhost:3001");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
