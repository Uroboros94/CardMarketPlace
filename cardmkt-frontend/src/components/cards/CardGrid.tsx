"use client";
import { CardGridItem } from "./CardGridItem";
import type { Card } from "@/types";

interface Props {
  cards: Card[];
  isLoading: boolean;
  onSelectCard: (card: Card) => void;
}

export function CardGrid({ cards, isLoading, onSelectCard }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#0f1624] border border-[#1e2d45] rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full" style={{ paddingBottom: "139%" }} />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-[#1e2d45] rounded w-3/4" />
              <div className="h-3 bg-[#1e2d45] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-[#4a5f7a]">
        <p className="text-5xl mb-3">🃏</p>
        <p className="text-base">No se encontraron cartas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="animate-slide-up"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          <CardGridItem card={card} onClick={onSelectCard} />
        </div>
      ))}
    </div>
  );
}
