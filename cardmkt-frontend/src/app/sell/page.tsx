"use client";
import { useState } from "react";
import { useCreateListing } from "@/hooks/useListings";
import { formatCOP, formatUSD, copToUsd } from "@/lib/currency";
import { useAppStore } from "@/store";
import type { Condition, Language, Game } from "@/types";

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "NM", label: "NM — Near Mint" },
  { value: "LP", label: "LP — Lightly Played" },
  { value: "MP", label: "MP — Moderately Played" },
  { value: "HP", label: "HP — Heavily Played" },
  { value: "DMG", label: "DMG — Damaged" },
];

export default function SellPage() {
  const { currency } = useAppStore();
  const { mutate, isPending } = useCreateListing();
  const [form, setForm] = useState({
    cardName: "",
    setName: "",
    game: "mtg" as Game,
    condition: "NM" as Condition,
    language: "EN" as Language,
    priceCop: "",
    quantity: "1",
    city: "",
    notes: "",
  });

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const previewCOP = Number(form.priceCop) || 0;

  const handleSubmit = () => {
    mutate({
      condition: form.condition,
      language: form.language,
      priceCop: previewCOP,
      quantity: Number(form.quantity),
      notes: form.notes,
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-1.5">Publicar carta</h2>
      <p className="text-[#4a5f7a] text-sm mb-7">
        Completa los datos de tu carta. El precio de referencia se cargará automáticamente desde TCGPlayer.
      </p>

      <div className="bg-[#0f1624] border border-[#1e2d45] rounded-2xl p-7 flex flex-col gap-5">
        <Field label="Nombre de la carta">
          <Input placeholder="ej. Black Lotus" value={form.cardName} onChange={(v) => set("cardName", v)} />
        </Field>

        <Field label="Set / Edición">
          <Input placeholder="ej. Alpha, LOB" value={form.setName} onChange={(v) => set("setName", v)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Juego">
            <Select value={form.game} onChange={(v) => set("game", v)}>
              <option value="mtg">Magic: The Gathering</option>
              <option value="yugioh">Yu-Gi-Oh!</option>
            </Select>
          </Field>
          <Field label="Condición">
            <Select value={form.condition} onChange={(v) => set("condition", v)}>
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Idioma">
            <Select value={form.language} onChange={(v) => set("language", v)}>
              <option value="EN">Inglés (EN)</option>
              <option value="ES">Español (ES)</option>
              <option value="JP">Japonés (JP)</option>
            </Select>
          </Field>
          <Field label="Cantidad">
            <Input type="number" placeholder="1" value={form.quantity} onChange={(v) => set("quantity", v)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (COP)">
            <Input type="number" placeholder="ej. 150000" value={form.priceCop} onChange={(v) => set("priceCop", v)} />
          </Field>
          <Field label="Ciudad">
            <Input placeholder="ej. Bogotá" value={form.city} onChange={(v) => set("city", v)} />
          </Field>
        </div>

        <Field label="Notas (opcional)">
          <Input placeholder="ej. Tiene pequeña marca en el borde" value={form.notes} onChange={(v) => set("notes", v)} />
        </Field>

        {/* Price preview */}
        {previewCOP > 0 && (
          <div className="bg-[rgba(56,189,248,0.07)] border border-[rgba(56,189,248,0.2)] rounded-xl p-3.5">
            <p className="text-xs text-[#38bdf8] mb-1">Vista previa del precio</p>
            <p className="font-extrabold font-display text-xl text-[#e2e8f0]">
              {formatCOP(previewCOP)}
            </p>
            <p className="text-xs text-[#4a5f7a] font-display mt-0.5">
              ≈ {formatUSD(copToUsd(previewCOP))} USD
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-[#38bdf8] text-[#080c14] font-extrabold font-display text-base py-3 rounded-xl hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Publicando…" : "Publicar oferta"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-[#4a5f7a] uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text" }: { placeholder?: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-[#161e30] border border-[#1e2d45] rounded-lg text-[#e2e8f0] text-sm placeholder-[#4a5f7a] outline-none focus:border-[#38bdf8] transition-colors"
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-[#161e30] border border-[#1e2d45] rounded-lg text-[#94a3b8] text-sm outline-none cursor-pointer focus:border-[#38bdf8] transition-colors"
    >
      {children}
    </select>
  );
}
