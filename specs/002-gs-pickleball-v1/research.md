# Research: GS Pickleball v1 Core

**Date**: 2025-09-24
**Source Spec**: specs/002-gs-pickleball-v1/spec.md

## Unknowns to Resolve

- Geo → Timezone mapping choice; DST behavior for “open now”.
- Default geo radius (25 miles) and tie-breaker strategy (distance + relevance).
- Synonyms list and typo tolerance thresholds in search.
- Email alert cadence, quiet hours, and unsubscribe granularity.
- Program required fields and validation nuances.

## Findings and Decisions

### Timezone and DST for “Open now”

- Decision: Use geo-derived timezone; rely on a timezone conversion library for DST.
  Rationale: Reliability and correctness; minimal manual rule handling.
  Alternatives: Custom rules — rejected due to complexity and risk.
- Implementation choice (non-binding): `tz-lookup` (lat/lng → IANA TZ) + `date-fns-tz` for conversions.
  Alternatives: `luxon` or `moment-timezone` — acceptable but heavier; native `Intl` partially sufficient.

### Search semantics (Typesense) — parameters

- Decision: Default radius 25 miles (40 km); sort primarily by geo distance with relevance tie-breakers.
  Rationale: Matches local discovery patterns; balanced recall and precision.

- Decision: Fields and weights
  - query_by: `name,city,tags,amenities`
  - query_by_weights: `3,2,2,1`
  - prefix: `true` (prefix search enabled)
  - num_typos: `2` (aggressive but acceptable for names/cities)
  - facet_by: `indoor,lights,open`
  - sort_by: `_geo(point(LAT,LNG)):asc` (caller supplies LAT/LNG)

- Decision: Synonyms and typo tolerance
  - Synonyms: `pickleball ↔ pickle ball`, `clinic ↔ lesson`, `league ↔ ladder`
  - Typo tolerance: enabled for all query fields
  - Alternatives: Disable for `amenities` — rejected (reduces recall for common misspellings).

### Email digests and quiet hours

- Decision: Email digests daily/weekly; quiet hours 21:00–07:00 local; per-category opt-out.
  Rationale: User respect and control; avoids notification fatigue.

- Scheduling defaults
  - Daily: 09:00 local; Weekly: Monday 09:00 local.
  - Batch: group notifications by category and locality to reduce email volume.
  - Unsubscribe: per-category link included in each email.

### Program fields and validation

- Decision: Required fields per spec; status supports `scheduled | cancelled | moved`.
  Rationale: Completeness for planning and user confidence.
- Validation rules
  - `level_min` and `level_max` in {2.0, 2.5, …, 5.0} and `level_min ≤ level_max`
  - `start < end` and both ISO 8601 timestamps (venue-local time)
  - `price ≥ 0`, `capacity ≥ 0`
  - If `status = moved`, include `original_time` (ISO)

## Risks & Mitigations

- Risk: Over-typo tolerance reduces precision.
  Mitigation: Tune `num_typos` to `1` for short queries (<4 chars); add per-field overrides if needed.
- Risk: Timezone edge cases (e.g., DST boundary) lead to incorrect “open now”.
  Mitigation: Add unit tests for DST transitions and overnight intervals; use authoritative tz database.
- Risk: Email fatigue from digests.
  Mitigation: Default weekly digests on; daily opt-in; clear per-category unsubscribes.

## Next Steps

- Reflect decisions in contracts and data model.
- Validate choices against acceptance criteria and performance budgets.
- Prepare quickstart validation scenarios.

Ready: This research resolves the Phase 0 unknowns and is ready to proceed to Phase 1 (Design & Contracts).

## Version Pins (current)

- Next.js 14.2.x
- Prisma 5.22.x
- Node 20.18.x
- Typesense Server 0.25.2; JS client 1.8.2
- Mapbox GL JS 2.x
- Supabase Postgres 17.x with PostGIS 3.x

## Vendor Choices

- Search: Typesense (local Docker in dev; Cloud for prod).  
  Alternative: Meilisearch (self-host) — deferred.
- Hosting: Vercel for Next.js, Supabase managed DB.  
  Alternative: Railway/Fly — deferred.
- Email: Postmark.  
  Alternative: Resend — evaluate if templates needed.
- Payments: Stripe — targeted for v2 milestone.

## Decision Records

- D‑01: Cron delta indexing over DB triggers for v1.  
  Rationale: lower ops risk. Revisit at 10k updates/day.
- D‑02: Email magic link auth only for v1.  
  Rationale: speed and fewer flows.
- D‑03: No semantic search in v1.  
  Rationale: local names short; facets suffice.
- D‑04: PgBouncer pooled username `postgres.<project-ref>` required for 6543 pooling.  
  Rationale: avoids "Tenant or user not found"; tested.
- D‑05: Prisma on Node 20.  
  Rationale: Node 22 caused client errors; pinned to Node 20.18.x.
- D‑06: Typesense local in Docker for dev; Cloud in prod.  
  Rationale: fast iteration without keys; switch by env.

## Gap Log (Open)

| ID | Topic | Question | Owner | Due | Status |
|---|---|---|---|---|---|
| G‑01 | LBTS photo rights | Written permission terms and logo use? | Partnerships | T‑0+7d | Open |
| G‑02 | Court data source TOS | Can we scrape all listed venues? Any rate limits? | Legal | T‑0+10d | Open |
| G‑03 | Typesense pricing tier | Which cluster size meets P95 ≤150 ms at N=5k docs? | Eng | T‑0+5d | Open |
| G‑04 | Indoor complexes 2026 | Confirm facility timelines for sponsorship pages | Partnerships | T‑0+21d | Open |
| G‑05 | Mapbox billing | Forecast monthly MAUs at launch | PM | T‑0+7d | Open |
| G‑06 | Program ingestion | Standardize schedules from CourtReserve/Club websites | Data | T‑0+14d | Open |
| G‑07 | DB geo strategy | Do we need PostGIS `geog` + GiST in v1 if Typesense handles distance? | Eng | T‑0+10d | Open |

## Benchmarks

- Seed data search P95 ≤150 ms measured with 3‑node small cluster.  
  Re‑measure after 1k venues.
