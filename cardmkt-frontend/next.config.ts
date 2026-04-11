import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirige /api/* al backend en Railway sin exponer la URL en el cliente
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },

  // Dominios permitidos para next/image (cartas de Scryfall y YGOPRODeck)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
      },
      {
        protocol: "https",
        hostname: "images.ygoprodeck.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev", // Cloudflare R2 para fotos de inventario
      },
    ],
  },
};

export default nextConfig;
