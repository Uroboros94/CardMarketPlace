import { Queue, Worker } from "bullmq";
import { redis } from "../lib/redis";
import { syncAllPrices } from "../services/tcgplayer";

export const priceSyncQueue = new Queue("price-sync", { connection: redis });
export const priceSyncWorker = new Worker("price-sync", async () => syncAllPrices(), { connection: redis });

export async function schedulePriceSync() {
  await priceSyncQueue.add("sync", {}, {
    repeat: { every: 1000 * 60 * 60 * 6 },
    removeOnComplete: 10,
    removeOnFail: 5,
  });
  console.log("[Jobs] Price sync scheduled every 6h");
}
