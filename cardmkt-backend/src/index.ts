import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import { db } from "./lib/db";
import { authRoutes } from "./routes/auth";
import { cardsRoutes } from "./routes/cards";
import { listingsRoutes } from "./routes/listings";
import { schedulePriceSync } from "./jobs/priceSync";

const app = Fastify({ logger: { level: process.env.NODE_ENV === "production" ? "warn" : "info" } });

// Orígenes permitidos — agrega más separados por coma en FRONTEND_URL si es necesario
const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  "http://localhost:3000",
];

// Plugins
app.register(helmet);
app.register(cors, {
  origin: (origin, cb) => {
    // Permitir peticiones sin origen (ej: Railway healthcheck, Postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido: ${origin}`), false);
  },
  credentials: true,
});
app.register(jwt, { secret: process.env.JWT_SECRET! });

// Health check
app.get("/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

// Routes
app.register(authRoutes);
app.register(cardsRoutes);
app.register(listingsRoutes);

// Global error handler
app.setErrorHandler((err, req, reply) => {
  if (err.name === "ZodError") return reply.code(400).send({ error: "Validation error", details: err });
  app.log.error(err);
  reply.code(err.statusCode ?? 500).send({ error: err.message ?? "Internal server error" });
});

// Start
const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
    await schedulePriceSync();
    console.log(`🚀 Server running on port ${process.env.PORT ?? 3001}`);
  } catch (err) {
    app.log.error(err);
    await db.$disconnect();
    process.exit(1);
  }
};

start();
