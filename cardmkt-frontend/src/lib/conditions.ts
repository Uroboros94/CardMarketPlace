import type { Condition } from "@/types";

export const CONDITION_LABELS: Record<Condition, string> = {
  NM: "Near Mint",
  LP: "Lightly Played",
  MP: "Moderately Played",
  HP: "Heavily Played",
  DMG: "Damaged",
};

export const CONDITION_COLORS: Record<Condition, string> = {
  NM: "#22c55e",
  LP: "#84cc16",
  MP: "#eab308",
  HP: "#f97316",
  DMG: "#ef4444",
};
