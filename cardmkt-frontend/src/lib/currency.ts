const DISCOUNT = Number(process.env.NEXT_PUBLIC_USD_RATE_DISCOUNT ?? 0.9);
const BASE_RATE = 4180;
export const USD_TO_COP = BASE_RATE * DISCOUNT;

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}

export function copToUsd(cop: number): number {
  return cop / USD_TO_COP;
}

export function usdToCop(usd: number): number {
  return usd * USD_TO_COP;
}
