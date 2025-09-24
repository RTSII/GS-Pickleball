# Architecture Overview

This app is a Next.js 14 (App Router) web app with Supabase Postgres/PostGIS for storage and Typesense Cloud for search.

## Components

- Web (Next.js)
  - `app/` routes and API handlers under `app/api/*`
  - Minimal UI in `app/page.tsx` for testing search
- Database (Supabase Postgres)
  - Prisma models in `prisma/schema.prisma`
  - PostGIS computed `geog` and GiST index via `prisma/migrations/0001_postgis/steps.sql`
- Search (Typesense)
  - Collections: `venues`, `programs`, `coaches` (`scripts/typesense-setup.ts`)
  - Full indexer: `scripts/reindex.ts`
  - Delta indexer (cron): `scripts/changed-since.ts` (uses `LOOKBACK_MINUTES`)
- Utilities
  - `lib/openNow.ts`: derive `open_now` from hours JSON in venue documents

## Data Flow

1. Data in Postgres (via Prisma models)
2. Indexers transform DB rows → Typesense documents (add `_geo`, `open_now`, facets)
3. API routes call Typesense using search key
4. UI calls API routes and renders results

## Security model

- Admin key: `TYPESENSE_ADMIN_KEY` (server-only, used by scripts)
- Search key: `TYPESENSE_SEARCH_KEY` (server; optionally `NEXT_PUBLIC_*` when searching from client)
- Never bundle admin keys client-side

## Performance targets

- Search API P95 ≤150 ms
- App LCP ≤2.0s on 4G

See `specs/001-gs-pickleball-core/` for the living spec, plan, and tasks.

## API Endpoints (current)

- `GET /api/search/venues` — calls Typesense `venues` collection with `query_by=name,city,tags`, distance sort via `_geo` and optional facets (`indoor`, `lights`, `open`).
  - Implementation: `app/api/search/venues/route.ts`.
- `GET /api/search/programs` — scaffold present for program search; wire up schema/fields in implementation.

## Environment variables

- Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Typesense (single host example): `TYPESENSE_HOST`, `TYPESENSE_PORT` (default 443), `TYPESENSE_PROTOCOL` (https)
- Keys: `TYPESENSE_SEARCH_KEY` (server-side search), `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY` (optional client search)
- Indexing: `TYPESENSE_ADMIN_KEY` (scripts only)

## Indexing scripts

- Provision collections: `npm run typesense:setup` (`scripts/typesense-setup.ts`)
- Full reindex: `npm run index:full`
- Delta index: `npm run index:delta` (uses `LOOKBACK_MINUTES`)

## Deployment

- Vercel-ready. Configure the env vars above in Vercel Project Settings (Production & Preview). Build with `npm run build`.
