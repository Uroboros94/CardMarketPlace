# CardMktCO — Frontend

Next.js 14 + Tailwind CSS + React Query + Zustand.

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001 (ya viene configurado)

# 3. Iniciar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Importar repositorio en [Vercel](https://vercel.com)
2. Framework: **Next.js** (detectado automáticamente)
3. Agregar variable de entorno:
   - `NEXT_PUBLIC_API_URL` = URL de tu backend en Railway
4. Deploy 🚀

## Estructura

```
src/
  app/
    layout.tsx       → Layout global (fuentes, Navbar, Providers)
    page.tsx         → Página principal (catálogo)
    sell/page.tsx    → Formulario de publicar carta
    globals.css      → Estilos globales + variables CSS
    providers.tsx    → React Query provider
  components/
    layout/
      Navbar.tsx     → Barra de navegación con toggle COP/USD
    cards/
      CardGrid.tsx   → Grid de cartas con skeleton loader
      CardGridItem.tsx → Tarjeta individual del catálogo
      CardModal.tsx  → Modal de detalle + listings
  hooks/
    useCards.ts      → React Query hook para cartas
    useListings.ts   → React Query hook para listings
  lib/
    api.ts           → Axios instance con interceptores JWT
    currency.ts      → Formateo COP/USD y tasa de conversión
    conditions.ts    → Labels y colores por condición
  store/
    index.ts         → Zustand store (currency, auth)
  types/
    index.ts         → TypeScript interfaces compartidas
```
