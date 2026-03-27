import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency, User } from "@/types";

interface AppState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currency: "COP",
      setCurrency: (currency) => set({ currency }),
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    { name: "cardmkt-store", partialize: (s) => ({ currency: s.currency }) }
  )
);
