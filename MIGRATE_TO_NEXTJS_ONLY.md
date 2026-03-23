# Migration: Convert G-Trace to Next.js-Only Project

This guide tells the agent how to eliminate the separate Express `api-server` artifact and move everything into the existing Next.js `gtrace` app so the project deploys cleanly on Vercel as a single Next.js application.

---

## Why

The current project has two separate artifacts:
- `artifacts/api-server` — Express 5 + MongoDB API server (causes Vercel TypeScript/build issues)
- `artifacts/gtrace` — Next.js 15 frontend (proxies `/api/*` to localhost:8080)

Next.js has built-in API route support. Moving all Express routes into Next.js App Router API routes eliminates the separate server entirely.

---

## Step-by-Step Instructions

### 1. Copy shared server-side files into `artifacts/gtrace/src/server/`

Create the directory `artifacts/gtrace/src/server/` and copy these files from `artifacts/api-server/src/`:

- `lib/mongodb.ts` → `artifacts/gtrace/src/server/mongodb.ts`
  - Change the mongoose import to use the Next.js connection caching pattern (see below)
- `lib/trackingId.ts` → `artifacts/gtrace/src/server/trackingId.ts`
- `lib/distance.ts` → `artifacts/gtrace/src/server/distance.ts`
- `lib/locations.ts` → `artifacts/gtrace/src/server/locations.ts`
- `models/Package.ts` → `artifacts/gtrace/src/server/Package.ts`
  - Update any relative imports to point to the new paths

Use this Next.js-safe MongoDB connection pattern in `mongodb.ts`:

```ts
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectMongoDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URL) throw new Error("MONGODB_URL is not set");

  let url = MONGODB_URL.trim();
  // Inject "gtrace" database name if missing
  const qIndex = url.indexOf("?");
  const base = qIndex !== -1 ? url.slice(0, qIndex) : url;
  const qs = qIndex !== -1 ? url.slice(qIndex) : "";
  const afterProtocol = base.slice(base.indexOf("//") + 2);
  if ((afterProtocol.match(/\//g) || []).length === 0) {
    url = `${base}/gtrace${qs}`;
  } else {
    url = base.replace(/\/([^/?]*)(\?|$)/, "/gtrace$2") + qs;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(url).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 2. Add `mongoose` as a dependency to `artifacts/gtrace`

Run:
```
pnpm --filter @workspace/gtrace add mongoose
pnpm --filter @workspace/gtrace add -D @types/mongoose
```

### 3. Create Next.js API Routes in `artifacts/gtrace/src/app/api/`

Create the following route files. Each file gets `connectMongoDB()` called at the top of the handler.

#### `app/api/healthz/route.ts`
```ts
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
```

#### `app/api/packages/track/[trackingId]/route.ts`
Port the logic from `artifacts/api-server/src/routes/packages.ts` — `GET /packages/track/:trackingId`

#### `app/api/locations/search/route.ts`
Port the logic from `GET /locations/search` — uses `searchLocations(q)` from `lib/locations.ts`

#### `app/api/admin/packages/route.ts`
Port `GET /admin/packages` (list all) and `POST /admin/packages` (create)

#### `app/api/admin/packages/[id]/route.ts`
Port `GET /admin/packages/:id`, `PUT /admin/packages/:id`, `DELETE /admin/packages/:id`

#### `app/api/admin/packages/[id]/location/route.ts`
Port `PUT /admin/packages/:id/location`

#### `app/api/admin/packages/[id]/schedule-move/route.ts`
Port `POST /admin/packages/:id/schedule-move`

Each route file should follow this pattern:
```ts
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();
    // ... handler logic
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

### 4. Remove the proxy rewrite from `artifacts/gtrace/next.config.ts`

Delete the `rewrites()` block entirely:
```ts
// REMOVE THIS:
async rewrites() {
  return [{ source: "/api/:path*", destination: "http://localhost:8080/api/:path*" }];
},
```

The API routes are now handled natively by Next.js.

### 5. Update `MONGODB_URL` environment variable

Make sure `MONGODB_URL` is set in Replit secrets (already requested) AND in Vercel project environment variables.

### 6. Remove the `api-server` artifact

- Delete `artifacts/api-server/` directory entirely
- Remove the `api-server` artifact registration (the `.replit-artifact/artifact.toml` inside it)
- Remove the `API Server` and `artifacts/api-server: API Server` workflows
- Remove `@workspace/api-server` from any workspace references in the root `pnpm-workspace.yaml` if present

### 7. Remove now-unused shared libraries (optional cleanup)

- `lib/api-zod` — can be kept for Zod schemas used in the frontend, or removed if unused
- `lib/api-client-react` — remove if all fetching is now done via native `fetch` in Next.js
- `lib/api-spec` — remove if no longer generating code
- `lib/db` — remove (was never used; the project uses MongoDB not Drizzle/PostgreSQL)

### 8. Update `tsconfig.json` references in root `tsconfig.json`

Remove references to any deleted libraries from the root `tsconfig.json`.

### 9. Deploy to Vercel

After migration:
- Vercel project root directory: `artifacts/gtrace`
- Framework: Next.js (auto-detected)
- No separate API server needed
- Add `MONGODB_URL` in Vercel environment variables

---

## Current API Surface (for reference)

All routes are currently prefixed with `/api`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| GET | `/api/packages/track/:trackingId` | Public package tracking |
| GET | `/api/locations/search?q=` | Location search |
| GET | `/api/admin/packages` | List all packages |
| POST | `/api/admin/packages` | Create package |
| GET | `/api/admin/packages/:id` | Get single package |
| PUT | `/api/admin/packages/:id` | Update package metadata |
| DELETE | `/api/admin/packages/:id` | Delete package |
| PUT | `/api/admin/packages/:id/location` | Update current location |
| POST | `/api/admin/packages/:id/schedule-move` | Schedule a location move |

---

## Files to Reference

When porting the route logic, read these files from the current codebase:
- `artifacts/api-server/src/routes/packages.ts` — all package/location/schedule route handlers
- `artifacts/api-server/src/routes/health.ts` — health check
- `artifacts/api-server/src/models/Package.ts` — Mongoose model
- `artifacts/api-server/src/lib/locations.ts` — location search logic
- `artifacts/api-server/src/lib/distance.ts` — Haversine distance calculation
- `artifacts/api-server/src/lib/trackingId.ts` — tracking ID generator
