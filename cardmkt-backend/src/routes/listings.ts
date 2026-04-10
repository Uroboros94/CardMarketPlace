import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";
import { authenticate } from "../middleware/auth";

const createSchema = z.object({
  cardId: z.number(),
  condition: z.enum(["NM", "LP", "MP", "HP", "DMG"]),
  language: z.enum(["EN", "ES", "JP"]).default("EN"),
  quantity: z.number().min(1).default(1),
  priceCop: z.number().positive(),
  notes: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

export async function listingsRoutes(app: FastifyInstance) {
  // GET /listings?cardId=X
  app.get<{ Querystring: { cardId?: string } }>("/listings", async (req, reply) => {
    const cardId = req.query.cardId ? Number(req.query.cardId) : undefined;
    const listings = await db.listing.findMany({
      where: {
        ...(cardId ? { cardId } : {}),
        status: "active",
        quantity: { gt: 0 },
      },
      include: {
        seller: { select: { id: true, name: true, city: true, rating: true, totalSales: true } },
      },
      orderBy: { priceCop: "asc" },
    });
    return reply.send(listings);
  });

  // POST /listings (auth required)
  app.post("/listings", { preHandler: authenticate }, async (req, reply) => {
    const user = req.user as { id: number };
    const body = createSchema.parse(req.body);

    const listing = await db.listing.create({
      data: {
        // ← campos explícitos en lugar de ...body + sellerId
        // Prisma no acepta mezclar spread con campos de relación
        sellerId: user.id,
        cardId: body.cardId,
        condition: body.condition,
        language: body.language,
        quantity: body.quantity,
        priceCop: body.priceCop,
        notes: body.notes,
        photos: body.photos,
      },
      include: {
        seller: { select: { id: true, name: true, city: true, rating: true, totalSales: true } },
      },
    });
    return reply.code(201).send(listing);
  });

  // PATCH /listings/:id/status (auth required)
  app.patch<{ Params: { id: string }; Body: { status: string } }>(
    "/listings/:id/status",
    { preHandler: authenticate },
    async (req, reply) => {
      const user = req.user as { id: number };
      const id = Number(req.params.id);
      const listing = await db.listing.findUnique({ where: { id } });
      if (!listing) return reply.code(404).send({ error: "Not found" });
      if (listing.sellerId !== user.id) return reply.code(403).send({ error: "Forbidden" });
      const updated = await db.listing.update({
        where: { id },
        data: { status: req.body.status as any },
      });
      return reply.send(updated);
    }
  );
}
