import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";
import { redis } from "../lib/redis";
import { authenticate } from "../middleware/auth";

const querySchema = z.object({
  game: z.enum(["mtg", "yugioh"]).optional(),
  search: z.string().optional(),
  condition: z.enum(["NM", "LP", "MP", "HP", "DMG"]).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(24),
});

const createCardSchema = z.object({
  game: z.enum(["mtg", "yugioh"]),
  name: z.string().min(1),
  setCode: z.string().min(1),
  setName: z.string().min(1),
  rarity: z.string().min(1),          // requerido en el schema
  imageUrl: z.string().url().optional(),
  collectorNumber: z.string().optional(),
  tcgplayerId: z.string().optional(),
  scryfallId: z.string().optional(),
  ygoprodeckId: z.string().optional(),
});

export async function cardsRoutes(app: FastifyInstance) {
  // GET /cards — catálogo público con stats de precio calculados desde listings
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
          listings: {
            where: { status: "active", quantity: { gt: 0 } },
            select: { priceCop: true, condition: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.card.count({ where }),
    ]);

    const data = cards.map((c) => {
      const prices = c.listings.map((l) => l.priceCop);
      return {
        ...c,
        listingCount: c.listings.length,
        priceMin: prices.length > 0 ? Math.min(...prices) : null,
        priceMax: prices.length > 0 ? Math.max(...prices) : null,
        priceAvg: prices.length > 0
          ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
          : null,
        listings: undefined,
      };
    });

    return reply.send({ data, total, page: q.page, pageSize: q.pageSize });
  });

  // GET /cards/:id — detalle público con listings activos
  app.get<{ Params: { id: string } }>("/cards/:id", async (req, reply) => {
    const id = Number(req.params.id);  // Int en el schema
    const cacheKey = `card:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) return reply.send(JSON.parse(cached));

    const card = await db.card.findUnique({
      where: { id },
      include: {
        listings: {
          where: { status: "active", quantity: { gt: 0 } },
          include: {
            seller: { select: { id: true, name: true, city: true, rating: true } },
          },
          orderBy: { priceCop: "asc" },
        },
      },
    });
    if (!card) return reply.code(404).send({ error: "Card not found" });

    const prices = card.listings.map((l) => l.priceCop);
    const result = {
      ...card,
      priceMin: prices.length > 0 ? Math.min(...prices) : null,
      priceMax: prices.length > 0 ? Math.max(...prices) : null,
      priceAvg: prices.length > 0
        ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
        : null,
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    return reply.send(result);
  });

  // POST /cards — solo usuarios registrados pueden agregar cartas al catálogo
  app.post("/cards", { preHandler: authenticate }, async (req, reply) => {
    const body = createCardSchema.parse(req.body);

    // Evitar duplicados por nombre + set
    const existing = await db.card.findFirst({
      where: { name: body.name, setCode: body.setCode },
    });
    if (existing) {
      return reply.code(409).send({ error: "Esta carta ya existe en el catálogo", card: existing });
    }

    const card = await db.card.create({
      data: {
        game: body.game,
        name: body.name,
        setCode: body.setCode,
        setName: body.setName,
        rarity: body.rarity,
        imageUrl: body.imageUrl,
        tcgplayerId: body.tcgplayerId,
        scryfallId: body.scryfallId,
        ygoprodeckId: body.ygoprodeckId,
      },
    });
    return reply.code(201).send(card);
  });
}
