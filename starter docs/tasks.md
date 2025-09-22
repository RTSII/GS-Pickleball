# GS Pickleball — Tasks

## Phase 0 — Project bootstrap
- [ ] Initialize repo and environments.
- [ ] Create Supabase project; enable `postgis` and `uuid-ossp`.
- [ ] Set env: Supabase URL/keys, Typesense keys, Mapbox token.

## Phase 1 — Data & schema
- [ ] Add Prisma models: Venue, Court, Program, Coach, Shop, Event, Photo, Claim, Review.
- [ ] Create `geog` computed column and GiST index for Venue.
- [ ] Seed 10 venues and 2 coaches for local testing.
- Acceptance: Prisma migrate passes; spatial index exists; CRUD works.

## Phase 2 — Search & API
- [ ] Provision Typesense Cloud; create collections for venues/programs/coaches.
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

## Command cheatsheet
- /constitution — principles, guidelines
- /specify — product spec (what/why)
- /plan — technical plan
- /tasks — task breakdown derived from plan
