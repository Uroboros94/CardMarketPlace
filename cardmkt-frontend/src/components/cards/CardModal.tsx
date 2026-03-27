"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAppStore } from "@/store";
import { useListingsByCard } from "@/hooks/useListings";
import { formatCOP, formatUSD, usdToCop, copToUsd } from "@/lib/currency";
import { CONDITION_COLORS } from "@/lib/conditions";
import type { Card } from "@/types";

interface Props {
  card: Card;
  onClose: () => void;
}

export function CardModal({ card, onClose }: Props) {
  const { currency } = useAppStore();
  const { data: listings = [] } = useListingsByCard(card.id);
  const ref = useRef<HTMLDivElement>(null);

  const marketCOP = usdToCop(card.prices?.priceMarket ?? 0);
  const avgCOP =
    listings.length > 0
      ? listings.reduce((s, l) => s + l.priceCop, 0) / listings.length
      : null;

  const fmt = (cop: number) =>
    currency === "USD" ? formatUSD(copToUsd(cop)) : formatCOP(cop);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        ref={ref}
        className="bg-[#0f1624] border border-[#1e2d45] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="flex gap-6 p-7">
          <div className="w-40 shrink-0 rounded-xl overflow-hidden border border-[#1e2d45] bg-[#161e30]">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={160}
                height={222}
                className="w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-[#4a5f7a]" style={{ minHeight: 222 }}>🃏</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex gap-2 flex-wrap mb-2">
              <Badge color={card.game === "mtg" ? "#a78bfa" : "#f59e0b"}>
                {card.game === "mtg" ? "MTG" : "YGO"}
              </Badge>
              <Badge color="#94a3b8">{card.rarity}</Badge>
              <Badge color="#64748b">{card.setCode}</Badge>
            </div>

            <h2 className="font-display font-extrabold text-xl text-[#e2e8f0] mb-3">{card.name}</h2>

            {/* TCGPlayer prices */}
            {card.prices && (
              <div className="p-3 bg-[#161e30] rounded-xl border border-[#1e2d45]">
                <p className="text-[10px] text-[#4a5f7a] uppercase tracking-widest mb-2">
                  Precio de referencia TCGPlayer
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([["Low", card.prices.priceLow], ["Market", card.prices.priceMarket], ["High", card.prices.priceHigh]] as [string, number][]).map(
                    ([label, val]) => (
                      <div key={label}>
                        <p className="text-[10px] text-[#4a5f7a] uppercase mb-0.5">{label}</p>
                        <p className="text-sm font-bold font-display text-[#e2e8f0]">
                          {fmt(usdToCop(val))}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {avgCOP && (
                  <div className="mt-3 pt-3 border-t border-[#1e2d45] flex justify-between items-center">
                    <p className="text-[10px] text-[#38bdf8] uppercase tracking-widest font-bold">
                      Mercado Promedio (listings)
                    </p>
                    <p className="text-base font-extrabold font-display text-[#e2e8f0]">
                      {fmt(avgCOP)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[#4a5f7a] hover:text-[#94a3b8] text-xl self-start shrink-0 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Listings */}
        <div className="px-7 pb-7">
          <h3 className="text-xs font-bold text-[#4a5f7a] uppercase tracking-widest mb-3">
            {listings.length} oferta{listings.length !== 1 ? "s" : ""} disponible{listings.length !== 1 ? "s" : ""}
          </h3>

          <div className="flex flex-col gap-2">
            {listings.map((l) => {
              const isCheap = l.priceCop < marketCOP * 0.95;
              const isExpensive = l.priceCop > marketCOP * 1.1;
              return (
                <div
                  key={l.id}
                  className={`flex items-center justify-between p-3.5 bg-[#161e30] rounded-xl border transition-colors flex-wrap gap-3 ${isCheap ? "border-[rgba(74,222,128,0.2)]" : "border-[#1e2d45]"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(56,189,248,0.07)] flex items-center justify-center font-extrabold text-sm text-[#38bdf8] font-display shrink-0">
                      {l.seller.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#e2e8f0] text-sm">{l.seller.name}</p>
                      <p className="text-xs text-[#4a5f7a]">
                        📍 {l.seller.city} · x{l.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={CONDITION_COLORS[l.condition]}>{l.condition}</Badge>
                    <Badge color="#64748b">{l.language}</Badge>
                    <div className="text-right">
                      <p className="font-extrabold font-display text-[17px] leading-none text-[#e2e8f0]">
                        {fmt(l.priceCop)}
                      </p>
                      {isCheap && <p className="text-[10px] text-[#4ade80]">↓ Bajo mercado</p>}
                      {isExpensive && <p className="text-[10px] text-[#f97316]">↑ Sobre mercado</p>}
                    </div>
                    <button className="bg-[#38bdf8] text-[#080c14] font-bold text-sm px-4 py-2 rounded-lg hover:opacity-85 transition-opacity whitespace-nowrap">
                      Contactar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded font-display tracking-wider"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
}
