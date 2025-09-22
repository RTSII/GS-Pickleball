# GS Pickleball — Research & Decision Log

## Purpose
Track fast‑moving stack choices, open questions, and decisions tied to milestones. Update before each release.

## Version pins (initial)
- Next.js 14.x
- Prisma 5.x
- Node 20.x
- Typesense Server 0.25.x; JS client 1.8.x
- Mapbox GL JS 2.x
- Supabase Postgres 15.x with PostGIS 3.x

## Vendor choices
- Search: Typesense Cloud (managed). Alternative: Meilisearch (self‑host) — deferred.
- Hosting: Vercel for Next.js, Supabase managed DB. Alternative: Railway/Fly — deferred.
- Email: Postmark. Alternative: Resend — evaluate if templates needed.
- Payments: Stripe — v2 milestone.

## Gap log
| ID | Topic | Question | Owner | Due | Status |
|---|---|---|---|---|---|
| G‑01 | LBTS photo rights | Written permission terms and logo use? | Partnerships | T‑0+7d | Open |
| G‑02 | Court data source TOS | Can we scrape all listed venues? Any rate limits? | Legal | T‑0+10d | Open |
| G‑03 | Typesense pricing tier | Which cluster size meets P95 ≤150 ms at N=5k docs? | Eng | T‑0+5d | Open |
| G‑04 | Indoor complexes 2026 | Confirm facility timelines for sponsorship pages | Partnerships | T‑0+21d | Open |
| G‑05 | Mapbox billing | Forecast monthly MAUs at launch | PM | T‑0+7d | Open |
| G‑06 | Program ingestion | Standardize schedules from CourtReserve/Club websites | Data | T‑0+14d | Open |

## Decision records
- D‑01: **Cron delta indexing** over DB triggers for v1. Rationale: lower ops risk. Revisit at 10k updates/day.
- D‑02: **Email magic link auth** only for v1. Rationale: speed and fewer flows.
- D‑03: **No semantic search** in v1. Rationale: local names short; facets suffice.

## Benchmarks
- Seed data search P95 ≤150 ms measured with 3‑node small cluster. Re‑measure after 1k venues.

## Links
- Spec: [`specify.md`](./specify.md)  
- Plan: [`plan.md`](./plan.md)  
- Constitution: [`constitution.md`](./constitution.md)
