import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";
import { redis } from "../lib/redis";

const querySchema = z.object({
  game: z.enum(["mtg", "yugioh"]).optional(),
  search: z.string().optional(),
  condition: z.enum(["NM", "LP", "MP", "HP", "DMG"]).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(24),
});

export async function cardsRoutes(app: FastifyInstance) {
  // GET /cards
  app.get("/cards", async (req, reply) => {
    const q = querySchema.parse(req.query);
    const skip = (q.page - 1) * q.pageSize;

    const where: any = {};
    if (q.game) where.game = q.game;
    if (q.search) where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { setName: { contains: q.search, mode: "insensitive" } },
    ];
    if (q.condition) where.listings = { some: { condition: q.condition, status: "active" } };

    const [cards, total] = await Promise.all([
      db.card.findMany({
        where,
        skip,
        take: q.pageSize,
        include: {
          prices: true,
          listings: {
            where: { status: "active" },
            select: { priceCop: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.card.count({ where }),
    ]);

    // Attach avgListingCop
    const data = cards.map((c) => ({
      ...c,
      listingCount: c.listings.length,
      avgListingCop: c.listings.length > 0
        ? c.listings.reduce((s, l) => s + l.priceCop, 0) / c.listings.length
        : null,
      listings: undefined,
    }));

    return reply.send({ data, total, page: q.page, pageSize: q.pageSize });
  });

  // GET /cards/:id
  app.get<{ Params: { id: string } }>("/cards/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const cacheKey = `card:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) return reply.send(JSON.parse(cached));

    const card = await db.card.findUnique({
      where: { id },
      include: { prices: true },
    });
    if (!card) return reply.code(404).send({ error: "Card not found" });

    await redis.setex(cacheKey, 3600, JSON.stringify(card));
    return reply.send(card);
  });
}
