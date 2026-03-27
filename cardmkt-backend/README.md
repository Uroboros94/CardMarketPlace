# CardMktCO — Backend

API REST con Fastify + PostgreSQL + Prisma + Redis + BullMQ.

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL, JWT_SECRET, etc.

# 3. Levantar Postgres y Redis con Docker (opcional)
docker run -d --name cardmkt-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cardmkt -p 5432:5432 postgres:16
docker run -d --name cardmkt-redis -p 6379:6379 redis:7

# 4. Generar cliente Prisma y correr migraciones
npm run db:generate
npm run db:migrate

# 5. Poblar base de datos con datos iniciales
npm run db:seed

# 6. Iniciar servidor en modo desarrollo
npm run dev
```

## Deploy en Railway

1. Crear nuevo proyecto en [Railway](https://railway.app)
2. Agregar servicio PostgreSQL y Redis desde el marketplace
3. Conectar este repositorio
4. Configurar variables de entorno en Railway (copiar de `.env.example`)
5. Railway detecta `railway.json` y hace el deploy automáticamente
6. Correr migraciones: `railway run npm run db:migrate`

## Endpoints

| Método | Ruta                    | Auth | Descripción                    |
|--------|-------------------------|------|--------------------------------|
| POST   | /auth/register          | ❌   | Registrar usuario              |
| POST   | /auth/login             | ❌   | Login, retorna JWT             |
| GET    | /auth/me                | ✅   | Perfil del usuario actual      |
| GET    | /cards                  | ❌   | Listar cartas con filtros      |
| GET    | /cards/:id              | ❌   | Detalle de una carta           |
| GET    | /listings?cardId=X      | ❌   | Listings activos de una carta  |
| POST   | /listings               | ✅   | Crear nuevo listing            |
| PATCH  | /listings/:id/status    | ✅   | Cambiar estado de un listing   |
| GET    | /health                 | ❌   | Health check                   |

## Estructura

```
src/
  index.ts          → Servidor Fastify
  lib/
    db.ts           → Prisma client
    redis.ts        → Redis client
  routes/
    auth.ts         → Registro, login, /me
    cards.ts        → Catálogo de cartas
    listings.ts     → Listings de vendedores
  services/
    tcgplayer.ts    → Integración TCGPlayer API
  jobs/
    priceSync.ts    → BullMQ job de sincronización
  middleware/
    auth.ts         → JWT verify middleware
  seed.ts           → Datos iniciales
```
