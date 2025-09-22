# Grand Strand Pickleball — Next.js App (Supabase + Typesense)

Runnable Next.js 14 app with Prisma (Supabase Postgres/PostGIS), Typesense search, and minimal UI to test venue search. Includes Spec Kit-aligned docs in `starter docs/`.

## Quickstart

1) Install dependencies

```bash
npm install
```

2) Configure environment

```bash
cp .env.example .env
# Fill in Supabase, Typesense, and Mapbox values
```

3) Database setup (Supabase)

```sql
-- In Supabase SQL editor
\i sql/0000_enable_extensions.sql
```

Run Prisma locally (optional, for types and client):

```bash
npx prisma generate
```

4) Provision Typesense collections

```bash
npm run typesense:setup
```

5) Start the app

```bash
npm run dev
```

Open http://localhost:3000 and use the search UI. The Search button calls `/api/search/venues` using your Typesense search key.

## Indexing data

- Full reindex: `npm run index:full`
- Delta upsert (LOOKBACK_MINUTES=10 by default): `npm run index:delta`

Both scripts require `TYPESENSE_ADMIN_KEY` and DB access. They load `.env` automatically and assert required env vars.

## Scripts

- `dev`, `build`, `start` — Next.js lifecycle
- `lint`, `format`, `format:fix` — ESLint and Prettier
- `typecheck` — TypeScript check without emit
- `test`, `test:watch` — Vitest unit tests (see `tests/`)
- `typesense:setup`, `index:full`, `index:delta` — Search setup and indexing

## Security and keys

- Never expose `TYPESENSE_ADMIN_KEY` to the browser.
- Server routes prefer `TYPESENSE_SEARCH_KEY` (non-public). Only use `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY` if you search directly from the browser.

## Docs (Spec Kit)

Agent-facing docs live in `starter docs/` and map to Spec Kit commands:

- `starter docs/constitution.md`
- `starter docs/specify.md`
- `starter docs/plan.md`
- `starter docs/tasks.md`

You can keep these as living docs or merge into `specs/001-gs-pickleball-core/`.

## File inventory (selected)

- `app/` — Next.js App Router, API routes under `api/`
- `lib/openNow.ts` — hours-to-open helper
- `prisma/` — Prisma schema and PostGIS steps
- `scripts/` — Typesense setup and indexers
- `sql/0000_enable_extensions.sql` — enable PostGIS + uuid
- `.github/workflows/ci.yml` — CI: typecheck, lint, tests, build

## License

MIT — see `LICENSE`.
