# Grand Strand Pickleball — Next.js App (Supabase + Typesense)

Runnable Next.js 14 app with Prisma (Supabase Postgres/PostGIS), Typesense search, and minimal UI to test venue search. Includes Spec Kit-aligned docs in `starter docs/`.

## Quickstart

Requires Node 18–20 (see `package.json > engines`), and npm.

1. Install dependencies

```bash
npm install
```

1. Configure environment

```bash
cp .env.example .env
# Fill in Supabase, Typesense, and Mapbox values
```

1. Database setup (Supabase)

```sql
-- In Supabase SQL editor
\i sql/0000_enable_extensions.sql
```

Run Prisma locally (optional, for types and client):

```bash
npx prisma generate
```

1. Provision Typesense collections

```bash
npm run typesense:setup
```

1. Start the app

```bash
npm run dev
```

Open <http://localhost:3000> and use the search UI. The Search button calls `/api/search/venues` using your Typesense search key.

If you haven’t configured Typesense yet (env + collections + indexing), the UI will load but searches will return no results. See “Indexing data” and “Deployment”.

## Indexing data

- Full reindex: `npm run index:full`
- Delta upsert (LOOKBACK_MINUTES=10 by default): `npm run index:delta`

Both scripts require `TYPESENSE_ADMIN_KEY` and DB access. They load `.env` automatically and assert required env vars.

### Quick index in 60 seconds

1. Ensure env in `.env`:
     - `TYPESENSE_HOST`, `TYPESENSE_PORT` (443), `TYPESENSE_PROTOCOL` (https)
     - `TYPESENSE_ADMIN_KEY` (for indexing), `TYPESENSE_SEARCH_KEY` (for API routes)

1. Provision collections:

```bash
npm run typesense:setup
```

1. Index data:

```bash
npm run index:full
```

1. Verify search works:
     - Open <http://localhost:3000>
     - Try a query; or call `GET /api/search/venues?q=pawleys`.

## Scripts

- `dev`, `build`, `start` — Next.js lifecycle
- `lint`, `format`, `format:fix` — ESLint and Prettier
- `typecheck` — TypeScript check without emit
- `test`, `test:watch` — Vitest unit tests (see `tests/`)
- `typesense:setup`, `index:full`, `index:delta` — Search setup and indexing

## Deployment (Vercel)

1. Create a Vercel project and connect this repo.
1. Configure Environment Variables for Production/Preview:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TYPESENSE_HOST` (or `TYPESENSE_NODES` JSON), `TYPESENSE_PORT`, `TYPESENSE_PROTOCOL`
- `TYPESENSE_SEARCH_KEY` (search-only key)
- `MAPBOX_PUBLIC_TOKEN` (optional if you add maps)

1. Build command: `npm run build` (default). Output: Next.js.

1. Run the provisioning and indexing steps at least once (from your local machine or a secure job):

```bash
npm run typesense:setup
npm run index:full
```

1. After deploy, verify `/` loads and `/api/search/venues` returns results when data exists in Typesense.

## Security and keys

- Never expose `TYPESENSE_ADMIN_KEY` to the browser.
- Server routes prefer `TYPESENSE_SEARCH_KEY` (non-public). Only use `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY` if you search directly from the browser.

## Troubleshooting

- Empty search results locally: ensure env vars are set, Typesense collections exist (`npm run typesense:setup`), and data is indexed (`npm run index:full`).
- 401/403 from Typesense: confirm you are using the search key on API routes, not the admin key; verify allowed hosts.
- Node version errors: use Node 18, 19, or 20 (see `"engines": ">=18 <21"`).

## Docs (Spec Kit)

Agent-facing docs live in `starter docs/` and map to Spec Kit commands:

- `starter docs/constitution.md`
- `starter docs/specify.md`
- `starter docs/plan.md`
- `starter docs/tasks.md`

You can keep these as living docs or merge into `specs/001-gs-pickleball-core/`.

### Canonical docs and workflows

- Constitution (current): <https://github.com/SpecKit/memory/blob/main/constitution.md> (v1.3.0)
- Product Specification (canonical): `docs/specify.md`
- Agent SOPs: `docs/agents/`
  - `crawler.md`, `normalizer.md`, `verifier.md`, `image-pipeline.md`, `moderation.md`, `analytics.md`
- Workflows: `.windsurf/workflows/`
  - `/auto-commit` — stage/commit/push with a message
  - `/specify` — create/update feature specs from a description
- TDD/CI config:
  - `vitest.config.ts` — coverage thresholds (Lines ≥70, Branches ≥60, Functions ≥70, Statements ≥70)
  - `.github/workflows/ci.yml` — typecheck → lint → format → tests → build

## File inventory (selected)

- `app/` — Next.js App Router, API routes under `api/`
- `lib/openNow.ts` — hours-to-open helper
- `prisma/` — Prisma schema and PostGIS steps
- `scripts/` — Typesense setup and indexers
- `sql/0000_enable_extensions.sql` — enable PostGIS + uuid
- `.github/workflows/ci.yml` — CI: typecheck, lint, tests, build

## License

MIT — see `LICENSE`.
