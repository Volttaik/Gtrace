# Workspace

## Overview

G-Trace is a premium global package tracking platform built as a pnpm monorepo using TypeScript. Features a stunning dark space-themed UI with animated Earth globe, real-time package tracking on interactive maps, and a full admin panel. The backend API is now fully integrated into the Next.js app — no separate Express server needed.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Framework**: Next.js 15 (App Router) — handles both frontend and API
- **Database**: MongoDB via Mongoose (MONGODB_URL secret)
- **Validation**: Zod (`zod/v4`)
- **Frontend**: React 19, Framer Motion, React-Leaflet, Tailwind CSS 4

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   └── gtrace/             # Next.js 15 app (frontend + API routes)
│       └── src/
│           ├── app/
│           │   ├── api/    # Next.js API routes (replaces Express api-server)
│           │   │   ├── healthz/route.ts
│           │   │   ├── locations/search/route.ts
│           │   │   ├── packages/track/[trackingId]/route.ts
│           │   │   └── admin/packages/
│           │   │       ├── route.ts            (list/create)
│           │   │       └── [id]/
│           │   │           ├── route.ts        (get/update/delete)
│           │   │           ├── location/route.ts
│           │   │           └── schedule-move/route.ts
│           │   ├── page.tsx      (Landing page with globe)
│           │   ├── track/        (Tracking page)
│           │   └── admin/        (Admin panel)
│           ├── server/     # Shared server-side code (MongoDB, models, utils)
│           │   ├── mongodb.ts
│           │   ├── Package.ts    (Mongoose model)
│           │   ├── locations.ts
│           │   ├── distance.ts
│           │   └── trackingId.ts
│           ├── components/ # UI components (shadcn/ui)
│           ├── hooks/      # React hooks
│           └── lib/        # Utilities
├── lib/
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
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

### API Routes (Next.js App Router — artifacts/gtrace/src/app/api/)
- `GET /api/healthz` — Health check
- `GET /api/packages/track/:trackingId` — Public tracking
- `GET /api/locations/search?q=...` — Location search (100+ global locations)
- `GET /api/admin/packages` — List all packages
- `POST /api/admin/packages` — Create package
- `GET /api/admin/packages/:id` — Get single package
- `PUT /api/admin/packages/:id` — Update package
- `DELETE /api/admin/packages/:id` — Delete package
- `PUT /api/admin/packages/:id/location` — Update current location
- `POST /api/admin/packages/:id/schedule-move` — Schedule automatic location move

## Environment Variables / Secrets

- `MONGODB_URL` — MongoDB Atlas connection string (points to gtrace database)

## Workflows

- **Start application** — Runs `PORT=3000 pnpm --filter @workspace/gtrace run dev` (Next.js dev server)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types after OpenAPI spec changes
