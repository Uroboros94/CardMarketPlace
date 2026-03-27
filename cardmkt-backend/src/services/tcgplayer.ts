import axios from "axios";
import { redis } from "../lib/redis";
import { db } from "../lib/db";

const BASE_URL = "https://api.tcgplayer.com";
let accessToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  const { data } = await axios.post(`${BASE_URL}/token`, new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.TCGPLAYER_CLIENT_ID!,
    client_secret: process.env.TCGPLAYER_CLIENT_SECRET!,
  }));
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60_000;
  return accessToken!;
}

export async function fetchCardPrices(tcgplayerIds: string[]) {
  const token = await getToken();
  const { data } = await axios.get(
    `${BASE_URL}/v1.39.0/pricing/product/${tcgplayerIds.join(",")}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.results as Array<{
    productId: number; lowPrice: number; midPrice: number;
    marketPrice: number; highPrice: number;
  }>;
}

export async function syncAllPrices() {
  console.log("[TCGPlayer] Starting price sync...");
  const cards = await db.card.findMany({
    where: { tcgplayerId: { not: null } },
    select: { id: true, tcgplayerId: true },
  });
  const BATCH = 250;
  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);
    try {
      const prices = await fetchCardPrices(batch.map((c) => c.tcgplayerId!));
      for (const p of prices) {
        const card = batch.find((c) => c.tcgplayerId === String(p.productId));
        if (!card) continue;
        await db.cardPrice.upsert({
          where: { cardId: card.id },
          update: { priceLow: p.lowPrice, priceMid: p.midPrice, priceMarket: p.marketPrice, priceHigh: p.highPrice },
          create: { cardId: card.id, priceLow: p.lowPrice, priceMid: p.midPrice, priceMarket: p.marketPrice, priceHigh: p.highPrice, currency: "USD" },
        });
        await redis.del(`card:${card.id}`);
      }
    } catch (err) {
      console.error(`[TCGPlayer] Batch ${i} failed:`, err);
    }
  }
  console.log(`[TCGPlayer] Synced ${cards.length} cards.`);
}
