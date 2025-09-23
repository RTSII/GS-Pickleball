# GS Pickleball — Technical Plan

> Note: The canonical product spec is `docs/specify.md` (aligned to constitution v1.3.0). Keep this plan consistent with the canonical spec and the TDD Pathway + AI Agents guardrails in `.specify/memory/constitution.md`.
>
> Cross‑check [`research.md`](./research.md) before each milestone. Pin versions and update decisions there if the stack moves.

## Architecture (linked to impl files)
- **DB**: Supabase Postgres + PostGIS via Prisma  
  • Models → [`/prisma/schema.prisma`](../prisma/schema.prisma)  
  • Enable extensions → [`/sql/0000_enable_extensions.sql`](../sql/0000_enable_extensions.sql)  
  • Initial migration (generated from Prisma) → [`/prisma/migrations/0001_init/migration.sql`](../prisma/migrations/0001_init/migration.sql)
- **Search**: Typesense (local Docker for dev; Cloud in prod)  
  • Collections → [`/scripts/typesense-setup.ts`](../scripts/typesense-setup.ts)  
  • Full indexer → [`/scripts/reindex.ts`](../scripts/reindex.ts)  
  • Delta indexer → [`/scripts/changed-since.ts`](../scripts/changed-since.ts)
- **API**: Next.js App Router routes  
  • Venues search → [`/app/api/search/venues/route.ts`](../app/api/search/venues/route.ts)  
  • Programs search → [`/app/api/search/programs/route.ts`](../app/api/search/programs/route.ts)
- **Logic utils**  
  • Open‑now helper → [`/lib/openNow.ts`](../lib/openNow.ts)

### Related canonical docs
- Product Specification (canonical): [`docs/specify.md`](../docs/specify.md)
- Constitution (v1.3.0): [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)
- Agent SOPs: [`docs/agents/`](../docs/agents/) — crawler, normalizer, verifier, image pipeline, moderation, analytics

---

## Executable sequence (numbered tasks with spec refs)

1) **Repo bootstrap** (Spec § Scope, Spec § Metrics)  
   - Init Next.js app. Install deps. Add `.env`. Commit CI hooks.

2) **Enable DB extensions** (Plan § Architecture → DB)  
   - In Supabase SQL editor run: `create extension postgis; create extension "uuid-ossp";`

3) **Apply schema and migrate** (Spec § Data model)  
   - Copy `prisma/schema.prisma`. Run `prisma migrate dev` and `prisma generate`.

4) **Add geospatial index** (Plan § Architecture → DB)  
   - Run PostGIS steps SQL to create `geog` and GiST index.

5) **Seed minimal data** (Spec § Acceptance criteria)  
   - Insert ≥10 venues and ≥2 coaches with hours. Verify CRUD and `geog` populated.

6) **Provision search** (Spec § Success metrics → Latency)  
   - Create Typesense cluster and keys. Run collections setup.

7) **Full index & drift check** (Plan § Indexing pipeline)  
   - Run `reindex.ts`. Compare DB vs index counts. Log drift in `research.md` if >1% (Spec § Metrics).

8) **Delta job** (Plan § Indexing pipeline)  
   - Schedule `changed-since.ts` every 10 minutes. Add monitoring log.

9) **Wire API contracts** (Plan § API contracts, Spec § Acceptance criteria)  
   - Implement `/api/search/venues` and `/api/search/programs`. Add zod validators. Record example requests.

10) **Map + list UI** (Spec § Core jobs-to-be-done)  
    - Mapbox GL cluster. Cards synced to bounds. Facets: indoor, lights, open‑now, lessons. Mobile first.

11) **Venue & program pages** (Spec § Scope)  
    - Show hours, fees, amenities, booking/contact. Validate links (200 OK). Level filter integrity.

12) **Empty/error states** (Spec § Error/empty states)  
    - Implement all states. Log errors with correlation IDs.

13) **Accessibility pass** (Spec § Accessibility criteria)  
    - Keyboard traversal. Alt text. Automated checks pass AA.

14) **Performance hardening** (Spec § Metrics and budgets)  
    - Hit budgets: Search P95 ≤150 ms, LCP ≤2.0 s, CLS ≤0.1, INP ≤200 ms.

15) **Release and monitor** (Plan § Observability)  
    - Sentry, logs, uptime. Weekly KPI digest. Capture gaps in `research.md` with owner/date.

---

## API contracts (copy-paste ready)

### Venues
**Endpoint**: `GET /api/search/venues`  
**Query**: `q, lat, lng, indoor, lights, open`  
**Response excerpt**
```json
{ "hits": [ { "document": {
  "id":"v_123","name":"LBTS Courts","city":"Pawleys Island",
  "indoor":false,"lights":true,"open_now":true,"_geo":[33.46,-79.12]
}}]}
```

### Programs
**Endpoint**: `GET /api/search/programs`  
**Query**: `q, kind=lesson|clinic|league|ladder|tournament, level, from=YYYY-MM-DD`  
**Response excerpt**
```json
{ "hits": [ { "document": {
  "id":"p_1","venue_id":"v_123","kind":"lesson",
  "level_min":3.0,"level_max":3.5,"start_ts":1737422400
}}]}
```

---

## Audit plan (functional, data, SEO, a11y, perf, security)

**Cadence**
- Weekly: KPI review, index drift, error budget, open gaps.  
- Monthly: SEO crawl, a11y audit, perf lab run on 4G profile, backup restore test.

**Functional** (Spec § Acceptance criteria)  
- E2E: search → venue; lessons filter; calendar export validation.  
- Contract tests on API schemas with fixtures.

**Data quality**  
- Index drift alert if |DB−Index|/DB > 1% by entity.  
- Dead link checker on booking/contact; auto‑hide broken CTAs.  
- Hours sanity: disallow >18h windows; flag 24/7 venues for review.

**SEO**  
- Validate schema.org on 10% sample. Check canonicals, sitemap, robots.  
- Unique copy check for locality pages.

**Accessibility**  
- Axe CI ruleset. Keyboard path for top 3 journeys.

**Performance**  
- Lighthouse CI with budgets (LCP, CLS, INP). Synthetic plus RUM percentiles.

**Security**  
- Keys scope review: search‑only in client, admin keys server‑only.  
- RLS on user‑submitted tables. Rate limits. Dependency audit.  
- Quarterly secrets rotation.

**Gaps log** → track in [`research.md`](./research.md#gap-log) with owner and due date.

---

## Over‑engineering review and simplifications

| Area | Risk | Simplification |
|---|---|---|
| Realtime CDC to Typesense via triggers | Adds ops and failure modes | Use 10‑minute cron delta job for v1 |
| OAuth providers in NextAuth | Adds setup and UI cost | Email magic link only v1 |
| Live bookings for all partners | Integrations and refunds complexity | Start with inquiry/CTA; pilot bookings with 1–2 partners |
| Vector or semantic search | Unneeded for short local strings | Rely on Typesense typo tolerance and facets |
| Microservices split | Overhead for small team | Single Next.js app with background jobs |
| Heavy analytics SDKs | Performance tax | Use lightweight RUM and server logs |
| Offline caching | Complexity and cache coherency | Basic HTTP caching; consider PWA later |

---

## Meta checklists

**Core tasks ordered and referenced?**  
- [ ] Steps 1–15 exist and each references Spec/Plan sections.  
- [ ] All endpoints list request/response examples.  
- [ ] File links point to intended repo paths.

**Unknowns captured as research TODOs?**  
- [ ] Open questions logged in `research.md` with owner, due date, success criteria.  
- [ ] Vendor choices and version pins documented.  
- [ ] Legal/TOS for data sources recorded.

**Non‑functional requirements testable?**  
- [ ] Budgets encoded in CI (Lighthouse, search latency smoke).  
- [ ] A11y CI enabled and manual keyboard test documented.  
- [ ] Error/empty states covered by tests and screenshots.  
- [ ] Index drift alert and reconciliation job configured.
