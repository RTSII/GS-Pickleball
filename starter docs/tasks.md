# GS Pickleball — Tasks

> Governance: Tasks align with the canonical constitution at
> `.specify/memory/constitution.md` (v1.3.0). Use Windsurf chat slash commands
> to keep tasks in sync: `/specify`, `/plan`, `/tasks`, `/implement`.
>
> Canonical product spec: `docs/specify.md`. Agent SOPs: `docs/agents/`.

## Phase 0 — Project bootstrap
- [ ] Initialize repo and environments.
- [ ] Pin Node to 20.18.x (nvm) and verify `npm ci` passes.
- [ ] Create Supabase project; enable `postgis` and `uuid-ossp`.
- [ ] Set env: Supabase URL/keys (use pooled username `postgres.<project-ref>`),
      Typesense keys (local admin key for dev), Mapbox token.
- [ ] Start local Typesense Docker (`typesense:0.25.2`) and verify `/health`.

## Phase 1 — Data & schema
- [ ] Add Prisma models: Venue, Court, Program, Coach, Shop, Event, Photo, Claim, Review.
- [ ] Create `geog` computed column and GiST index for Venue.
- [ ] Seed 10 venues and 2 coaches for local testing.
- Acceptance: Prisma migrate passes; spatial index exists; CRUD works.

## Phase 2 — Search & API
- [ ] Provision Typesense (local Docker for dev; Cloud for prod); create
      collections for venues/programs/coaches.
- [ ] Implement full reindex script; incremental delta job.
- [ ] API: `/api/search/venues` with facets + distance sort.
- [ ] API: `/api/search/programs` with date and level filters.
- Acceptance: search returns results under 150 ms P95 with seeded data.

## Phase 3 — Web app MVP
- [ ] Map + list UI with clustering and filters.
- [ ] Venue page with amenities, fees, booking link, and parking notes.
- [ ] Program and Coach pages.
- [ ] Public submission form with hCaptcha.
- Acceptance: “Open now” filter works; mobile layout verified.

## Phase 4 — Data pipelines
- [ ] Build crawler(s) for public lists; normalize JSON; geocode.
- [ ] Verification queue and call/email templates.
- [ ] Nightly reconciliation job and dead‑link checker.
- Acceptance: coverage reaches 75+ venues; verified >60%.

## Phase 5 — Monetization & partners
- [ ] Stripe subscriptions for featured listings; webhooks/dunning.
- [ ] Partner widget for venues (next 7 days of programs).
- [ ] LBTS and Litchfield partner pages with photos and credits.
- Acceptance: 5 paying partners; widget installed on at least 2 sites.

## Phase 6 — Growth
- [ ] Email alerts for new leagues in saved areas.
- [ ] SEO pages for Pawleys/Murrells/Myrtle/NMB intents.
- [ ] Sponsor packages for indoor complexes.

## Ongoing — QA & analytics
- [ ] KPI dashboard and weekly digest.
- [ ] Uptime, error alerts, and index drift alerts.

---

## CI & Governance
- [ ] Keep `.env.example` current; never commit secrets.
- [ ] Ensure Prisma/Typesense scripts run under Node 20.18.x in CI.
- [ ] Use pooled username format for PgBouncer (`postgres.<project-ref>`).
- [ ] Run `/tasks` in Windsurf chat to regenerate this list after any spec/plan changes.
 - [ ] Follow TDD Pathway and agent guardrails from `.specify/memory/constitution.md` (v1.3.0).
 - [ ] Reference canonical spec in `docs/specify.md` when updating scope or acceptance criteria.

## Command cheatsheet
- /constitution — principles, guidelines
- /specify — product spec (what/why)
- /plan — technical plan
- /tasks — task breakdown derived from plan
