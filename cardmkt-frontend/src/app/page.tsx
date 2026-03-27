"use client";
import { useState } from "react";
import { useCards } from "@/hooks/useCards";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardModal } from "@/components/cards/CardModal";
import type { Card, Condition, Game } from "@/types";

const GAMES: { id: Game | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "mtg", label: "Magic: The Gathering" },
  { id: "yugioh", label: "Yu-Gi-Oh!" },
];

const CONDITIONS: Condition[] = ["NM", "LP", "MP", "HP", "DMG"];

export default function HomePage() {
  const [game, setGame] = useState<Game | "all">("all");
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState<Condition | "all">("all");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const { data, isLoading } = useCards({
    game: game !== "all" ? game : undefined,
    search: search || undefined,
    condition: condition !== "all" ? condition : undefined,
  });

  return (
    <>
      {/* Hero */}
      <div className="mb-9 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] rounded-full bg-[radial-gradient(ellipse,rgba(56,189,248,0.13)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
          Compra y vende cartas<br />
          <span className="text-[#38bdf8]">en Colombia</span>
        </h1>
        <p className="mt-3 text-[#4a5f7a] text-base">
          Precios de referencia actualizados desde TCGPlayer · MTG · Yu-Gi-Oh!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-7">
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5f7a]">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar carta o set..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#0f1624] border border-[#1e2d45] rounded-xl text-[#e2e8f0] text-sm placeholder-[#4a5f7a] outline-none focus:border-[#38bdf8] transition-colors"
          />
        </div>

        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setGame(g.id)}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              game === g.id
                ? "bg-[rgba(56,189,248,0.07)] text-[#38bdf8] border-[rgba(56,189,248,0.27)]"
                : "bg-[#0f1624] text-[#4a5f7a] border-[#1e2d45] hover:text-[#94a3b8]"
            }`}
          >
            {g.label}
          </button>
        ))}

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as Condition | "all")}
          className="bg-[#0f1624] border border-[#1e2d45] rounded-xl px-3 py-2.5 text-[#94a3b8] text-sm outline-none cursor-pointer"
        >
          <option value="all">Condición</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-[#4a5f7a]">
          {data?.total ?? 0} cartas · {data?.data.reduce((s, c) => s + (c as any).listingCount ?? 0, 0)} ofertas activas
        </span>
        <div className="flex-1 h-px bg-[#1e2d45]" />
        <span className="text-xs text-[#4a5f7a] font-display">TRM: $3,762 COP/USD</span>
      </div>

      <CardGrid
        cards={data?.data ?? []}
        isLoading={isLoading}
        onSelectCard={setSelectedCard}
      />

      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </>
  );
}
