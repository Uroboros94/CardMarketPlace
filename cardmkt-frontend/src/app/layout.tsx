import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CardMktCO — Marketplace de cartas coleccionables en Colombia",
  description:
    "Compra y vende cartas de Magic: The Gathering y Yu-Gi-Oh! en Colombia. Precios de referencia actualizados desde TCGPlayer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-7">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
