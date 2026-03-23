# Workspace

## Overview

G-Trace is a premium global package tracking platform built as a pnpm monorepo using TypeScript. Features a stunning dark space-themed UI with animated Earth globe, real-time package tracking on interactive maps, and a full admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: MongoDB via Mongoose (MONGODB_URL secret)
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Framer Motion, React-Leaflet, Tailwind CSS

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server with MongoDB/Mongoose
│   └── gtrace/             # React + Vite frontend (G-Trace UI)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   └── api-zod/            # Generated Zod schemas from OpenAPI
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## G-Trace Features

### Frontend (artifacts/gtrace)
- **Landing Page** (`/`) — Canvas-based animated Earth globe, hero tracking input, feature cards, smooth framer-motion animations
- **Tracking Page** (`/track/:id`) — Interactive Leaflet map with origin/destination/current markers, progress bar, tracking history timeline
- **Admin Page** (`/admin`) — Package management table, create/edit packages, update location, schedule automated moves

### Backend (artifacts/api-server)
- MongoDB connection via Mongoose (`MONGODB_URL` secret)
- Package CRUD with auto-generated tracking IDs (`GT-xxx-xxxx` format)
- 100+ global locations: cities, ports (Jebel Ali, Rotterdam, Shanghai, etc.), airports, warehouses
- Haversine distance calculation for total/travelled distances
- Location update history tracking
- Scheduled move functionality (set arrival date in N days)

### API Routes
- `GET /api/packages/track/:trackingId` — public tracking
- `GET /api/admin/packages` — list all packages
- `POST /api/admin/packages` — create package
- `PUT /api/admin/packages/:id` — update package
- `DELETE /api/admin/packages/:id` — delete package
- `PUT /api/admin/packages/:id/location` — update current location (adds history event)
- `POST /api/admin/packages/:id/schedule-move` — schedule automatic location move
- `GET /api/locations/search?q=...` — search 100+ global locations

## Environment Variables / Secrets

- `MONGODB_URL` — MongoDB Atlas connection string (points to gtrace database)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types after OpenAPI spec changes
