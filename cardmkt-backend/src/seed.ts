import "dotenv/config";
import { db } from "./lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  const mtgCards = [
    { game: "mtg" as const, name: "Black Lotus", setCode: "LEA", setName: "Alpha", rarity: "Rare", tcgplayerId: "110", scryfallId: "bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd", imageUrl: "https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg" },
    { game: "mtg" as const, name: "Force of Will", setCode: "ALL", setName: "Alliances", rarity: "Uncommon", tcgplayerId: "1580", scryfallId: "dec9c476-1240-44b8-9377-e11fcca12074", imageUrl: "https://cards.scryfall.io/normal/front/d/e/dec9c476-1240-44b8-9377-e11fcca12074.jpg" },
    { game: "mtg" as const, name: "Liliana of the Veil", setCode: "ISD", setName: "Innistrad", rarity: "Mythic Rare", tcgplayerId: "53155", scryfallId: "feb96892-e465-4756-8f7c-49c7ef73ab35", imageUrl: "https://cards.scryfall.io/normal/front/f/e/feb96892-e465-4756-8f7c-49c7ef73ab35.jpg" },
  ];

  const ygoCards = [
    { game: "yugioh" as const, name: "Blue-Eyes White Dragon", setCode: "LOB", setName: "Legend of Blue Eyes", rarity: "Ultra Rare", ygoprodeckId: "89631139", imageUrl: "https://images.ygoprodeck.com/images/cards/89631139.jpg" },
    { game: "yugioh" as const, name: "Dark Magician", setCode: "SDK", setName: "Starter Deck Kaiba", rarity: "Ultra Rare", ygoprodeckId: "46986414", imageUrl: "https://images.ygoprodeck.com/images/cards/46986414.jpg" },
    { game: "yugioh" as const, name: "Exodia the Forbidden One", setCode: "LOB", setName: "Legend of Blue Eyes", rarity: "Ultra Rare", ygoprodeckId: "33396948", imageUrl: "https://images.ygoprodeck.com/images/cards/33396948.jpg" },
  ];

  for (const card of [...mtgCards, ...ygoCards]) {
    // Narrowing explícito para evitar el error de union type
    const tcgplayerId = 'tcgplayerId' in card ? card.tcgplayerId : `ygo-${card.ygoprodeckId}`
    const ygoprodeckId = 'ygoprodeckId' in card ? card.ygoprodeckId : null

    await db.card.upsert({
      where: { tcgplayerId },
      update: {},
      create: {
        game: card.game,
        name: card.name,
        setCode: card.setCode,
        setName: card.setName,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        tcgplayerId,
        ygoprodeckId,
        scryfallId: 'scryfallId' in card ? card.scryfallId : null,
        prices: {
          create: { priceLow: 10, priceMid: 15, priceMarket: 13, priceHigh: 18, currency: "USD" },
        },
      },
    });
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => db.$disconnect());
