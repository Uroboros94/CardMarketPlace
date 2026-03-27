"use client";
import Link from "next/link";
import { useAppStore } from "@/store";
import type { Currency } from "@/types";

export function Navbar() {
  const { currency, setCurrency, user, logout } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e2d45] bg-[rgba(8,12,20,0.85)] backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 rounded-lg bg-[#38bdf8] flex items-center justify-center">
            <span className="text-[#0f172a] font-extrabold text-sm font-display">C</span>
          </div>
          <span className="font-extrabold text-[17px] font-display tracking-tight text-[#e2e8f0]">
            CardMkt<span className="text-[#38bdf8]">CO</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex gap-1">
          <NavLink href="/">Catálogo</NavLink>
          <NavLink href="/sell">Publicar carta</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Currency toggle */}
          <div className="flex bg-[#0f1624] border border-[#1e2d45] rounded-lg overflow-hidden">
            {(["COP", "USD"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1.5 text-xs font-bold font-display transition-all ${
                  currency === c
                    ? "bg-[#38bdf8] text-[#080c14]"
                    : "text-[#4a5f7a] hover:text-[#94a3b8]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94a3b8] hidden sm:block">{user.name}</span>
              <button
                onClick={logout}
                className="text-xs text-[#4a5f7a] hover:text-[#94a3b8] transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#38bdf8] text-[#080c14] font-bold text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity no-underline"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm font-semibold text-[#4a5f7a] hover:text-[#e2e8f0] hover:bg-[#0f1624] rounded-lg transition-all no-underline"
    >
      {children}
    </Link>
  );
}
