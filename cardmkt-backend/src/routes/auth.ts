import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  city: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const exists = await db.user.findUnique({ where: { email: body.email } });
    if (exists) return reply.code(409).send({ error: "Email already registered" });

    const hashed = await bcrypt.hash(body.password, 10);
    const user = await db.user.create({
      data: { ...body, password: hashed },
      select: { id: true, email: true, name: true, city: true, role: true },
    });

    const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "30d" });
    return reply.code(201).send({ user, token });
  });

  app.post("/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.code(401).send({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) return reply.code(401).send({ error: "Invalid credentials" });

    const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "30d" });
    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, city: user.city, role: user.role },
      token,
    });
  });

  app.get("/auth/me", { preHandler: async (req, reply) => { try { await req.jwtVerify(); } catch { reply.code(401).send({ error: "Unauthorized" }); } } }, async (req, reply) => {
    const { id } = req.user as { id: number };
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, city: true, role: true, rating: true, totalSales: true },
    });
    return reply.send(user);
  });
}
