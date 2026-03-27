"use client";
import Image from "next/image";
import { useAppStore } from "@/store";
import { formatCOP, formatUSD, usdToCop, copToUsd } from "@/lib/currency";
import type { Card } from "@/types";

interface Props {
  card: Card;
  onClick: (card: Card) => void;
}

const RARITY_COLORS: Record<string, string> = {
  "Mythic Rare": "#f97316",
  "Rare": "#a78bfa",
  "Ultra Rare": "#f59e0b",
  "Uncommon": "#94a3b8",
  "Common": "#64748b",
};

export function CardGridItem({ card, onClick }: Props) {
  const { currency } = useAppStore();
  const marketCOP = usdToCop(card.prices?.priceMarket ?? 0);
  const avgCOP = (card as any).avgListingCop ?? marketCOP;

  const fmt = (cop: number) =>
    currency === "USD" ? formatUSD(copToUsd(cop)) : formatCOP(cop);

  return (
    <div
      onClick={() => onClick(card)}
      className="bg-[#0f1624] border border-[#1e2d45] rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-[rgba(56,189,248,0.27)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] group"
    >
      {/* Card image */}
      <div className="relative w-full overflow-hidden bg-[#161e30]" style={{ paddingBottom: "139%" }}>
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes="220px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#4a5f7a]">🃏</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1624] via-transparent to-transparent opacity-70" />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${card.game === "mtg" ? "bg-[rgba(167,139,250,0.15)] text-[#a78bfa] border border-[rgba(167,139,250,0.25)]" : "bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]"}`}>
            {card.game === "mtg" ? "MTG" : "YGO"}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[rgba(0,0,0,0.5)] border border-[#1e2d45]"
            style={{ color: RARITY_COLORS[card.rarity] ?? "#94a3b8" }}>
            {card.rarity}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 pb-3.5">
        <p className="font-display font-bold text-[15px] text-[#e2e8f0] truncate mb-0.5">{card.name}</p>
        <p className="text-xs text-[#4a5f7a] mb-2.5">{card.setName}</p>
        <div className="border-t border-[#1e2d45] pt-2.5 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-[#4a5f7a] uppercase tracking-wider mb-0.5">Ref. TCGPlayer</p>
            <p className="text-xs font-display text-[#94a3b8]">
              {fmt(marketCOP)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#4a5f7a] uppercase tracking-wider mb-0.5">Mercado Promedio</p>
            <p className="text-[13px] font-bold font-display text-[#e2e8f0]">
              {fmt(avgCOP)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
