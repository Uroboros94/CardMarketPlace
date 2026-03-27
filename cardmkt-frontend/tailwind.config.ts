import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        bg: "#080c14",
        surface: { DEFAULT: "#0f1624", 2: "#161e30" },
        border: "#1e2d45",
        accent: "#38bdf8",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        "text-muted": "#4a5f7a",
      },
    },
  },
  plugins: [],
};

export default config;
