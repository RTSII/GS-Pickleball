# GS Pickleball — Product Specification (Canonical)

## Summary

GS Pickleball is a local directory for the Grand Strand that answers:

- Where can I play right now?
- Who teaches at my level nearby?
- What leagues/clinics/tournaments can I join this month?
- Where can I buy or string paddles and gear?

### Governance & Alignment

- This spec aligns with the canonical constitution at `.specify/memory/constitution.md` (v1.3.0).
- Conformance to: Security & Secrets Hygiene, Data Model Is Source of Truth, Reliability/Tests/Observability, Accessibility & Performance, Search as a First‑Class Feature.
- Explicit pathways: TDD Pathway (tests-first, red–green–refactor) and AI Agents & Automation guardrails.

## Target users

- Residents: 2.5–4.0 players seeking drop‑in play and lessons.
- Visitors: Short‑trip players needing courts near lodging.
- Coaches/venues: Supply side seeking discovery and bookings.
- Shops: Retail and stringing providers.

## Core jobs-to-be-done

- Find courts by distance, indoor/outdoor, lights, fee, reservation rules.
- See “Open now” based on hours and current local time.
- Filter programs: lessons, clinics, leagues, ladders, tournaments by date, level, and price.
- Browse verified coaches with credentials and rates.
- Discover shops and demo days; find stringing services.
- Save favorites; subscribe to alerts for new leagues or openings.

## Goals (clear and measurable)

- Coverage: ≥75 venues listed in Grand Strand for v1; ≥60% verified by human or partner claim.
- Programs: ≥100 active programs (lessons/clinics/leagues/tournaments) with future dates.
- Search performance: P95 search API latency ≤150 ms; first contentful map/list paint ≤2.0 s on 4G.
- Conversion: ≥25% of venue views include a booking/contact click; ≥10 partner inquiries in first 30 days.
- SEO footprint: Index 4 locality-intent pages (Pawleys, Murrells, Myrtle, NMB) with unique copy and valid schema.

## Non‑goals (v1)

- Full social network or player matchmaking.
- Real‑time occupancy sensors or computer-vision counting.
- Multi‑region expansion beyond the Grand Strand.
- In‑app chat; we link to external booking/contact.

## Scope (v1)

- Map + list search with clustering and facets (indoor, lights, open-now, fee range, lessons available).
- Venue pages with amenities, fees, parking notes, booking links, hours.
- Program pages with date/time, level band, price, signup URL.
- Coach directory with profiles and inquiry CTA.
- Event calendar with iCal export.
- Partner embeddable widget for upcoming programs.

## Data model (overview)

- Venue: name, address, geo, indoor, lights, fees, hours, booking/contact, tags.
- Court: surface, covered, dedicated, permanent nets.
- Program: kind (lesson/clinic/league/ladder/tournament), level range, start/end, price, signup URL.
- Coach: name, credentials, cities served, rate, rating.
- Shop: services (retail/stringing/repairs/demo), contact, geo.
- Event: title, start/end, description, URL.

## Sources of truth

- Supabase Postgres + PostGIS stores canonical entities.
- Typesense indexes `venues`, `programs`, `coaches` for search (local Docker in dev; Cloud in prod).

## Key flows

1) Search → filter map/list → venue detail → external booking.
2) Lessons → coach/program filter → inquiry or checkout (v2).
3) Calendar → filter by area and type → export to calendar.

## Constraints

- Mobile-first; majority of discovery is on phones.
- Seasonality and weather; hours vary with daylight.
- Local‑first coverage: Pawleys Island → Murrells Inlet → Myrtle Beach → North Myrtle Beach.

---

## Testable acceptance criteria (v1)

- Search & filters
  - Given a user in Pawleys (lat/lng), when they search with `indoor=true` and `open_now=true`, results sort by distance and exclude outdoor-only venues.
  - Typo tolerance: query “pikleball” still returns top Pawleys venues with ≥0.7 relevance score.
- Venue detail
  - Venue page shows hours, amenities, fee range, and at least one booking or contact link. Links are validated with 200 OK or mailto/tel.
- Programs & levels
  - Filtering `kind=lesson` and `level=3.0` returns only programs where `level_min ≤ 3.0 ≤ level_max`.
- Open-now logic
  - For a venue with hours that include current local time (timezone-aware, including overnight windows), `open_now` badge is rendered; outside hours, badge is hidden.
- Calendar export
  - iCal export validates with no errors in Apple Calendar and Google Calendar.
- Performance
  - P95 `/api/search/venues` ≤150 ms on a warmed Typesense collection; LCP ≤2.0 s on a Moto G4 4G profile.
- Accessibility
  - Keyboard tab order covers map toggles, facets, and cards; all images have alt text; automated checks pass WCAG AA ruleset.
- TDD & Coverage
  - All new logic lands with unit/integration tests. Coverage thresholds: Lines ≥70%, Branches ≥60%, Functions ≥70%, Statements ≥70%.

---

## Error states and empty‑state UX (tight)

- Global
  - If Typesense query fails: show inline error “Search unavailable. Retrying…” with automatic backoff and a “Try again” button.
  - If Supabase API errors: show non-technical message, log correlation ID; do not expose stack traces.
- Search page
  - No results: show empty state with next steps: broaden radius, clear filters, or view all venues; display top 4 nearby public courts as suggestions.
  - Geo denied: fall back to manual location entry and default to Myrtle Beach centerpoint.
- Venue page
  - Missing hours: hide “open-now”; show “Hours not provided” and prompt venue to claim profile.
  - Invalid booking link: hide button; show contact phone/email if present.
- Programs
  - If no upcoming programs: show empty state with “Get alerts when new programs near you are added” CTA.
- Offline
  - Show read-only cached results where available; banner “You are offline—some data may be outdated.”

---

## Metrics and budgets

- Latency budgets
  - Search API P95 ≤150 ms; P99 ≤300 ms.
  - TTFB cached ≤200 ms; LCP ≤2.0 s on 4G; CLS ≤0.1; INP ≤200 ms.
- Index freshness
  - Delta index job every 10 minutes; nightly reconciliation drift ≤1%.
- Reliability
  - Search API SLO 99.9% monthly. Error budget tracked in ops notes.
- Engagement & conversion
  - Search→Venue CTR ≥35%.
  - Venue→Booking/Contact click ≥25%.
  - Email opt‑in ≥5% of eligible users.
- Coverage
  - Venues listed ≥75; verified ≥60% within 60 days.

---

## Security & Privacy

- Browser only uses search‑only Typesense key; admin key remains server‑only.
- SSL enforced for database connections. No secrets committed; document required env in `.env.example` and rotate keys on suspicion of leak.

---

## Review & Acceptance Checklist

- Coverage: ≥75 venues listed; ≥60% verified.
- Search: Facets work (indoor, lights, open-now); typo tolerance verified.
- Performance: Search API P95 ≤150 ms; LCP ≤2.0 s; CLS ≤0.1; INP ≤200 ms.
- Venue pages: Hours, amenities, fee range, and at least one valid booking/contact link.
- Programs: Level filter integrity (`level_min ≤ level ≤ level_max`) verified with test fixtures.
- Calendar: iCal export opens without errors in Apple and Google.
- Accessibility: WCAG 2.2 AA automated checks pass; keyboard-only journey validated.
- Error/empty states: All defined states implemented and covered by tests.
- Reliability: SLO and monitoring dashboards configured; alerting active.
- Security: Typesense search-only key in browser; admin keys server-only; RLS in place for user-submitted data.
- Agents: SOPs documented under `docs/agents/`; agent changes follow TDD and guardrails.

---

## Current Implementation Status (as of current commit)

- Minimal search UI at `/` connected to API routes.
- Typesense-backed search API implemented:
  - `app/api/search/venues/route.ts` supports query, distance sort, and facets `indoor`, `lights`, `open`.
  - `app/api/search/programs/route.ts` scaffold present for program search.
- Indexing utilities available:
  - Provision collections: `npm run typesense:setup` (see `scripts/typesense-setup.ts`).
  - Full reindex: `npm run index:full`.
  - Delta index: `npm run index:delta` (uses `LOOKBACK_MINUTES`).
- CI workflow (`.github/workflows/ci.yml`) runs typecheck → lint → format → tests → build.
- Coverage targets configured in `vitest.config.ts` per Acceptance Criteria.
- Deployment: Vercel-ready; environment variables documented in `README.md`.

## Endpoints & Scripts (v1)

- Endpoints
  - `GET /api/search/venues` → Typesense `venues` collection; `query_by=name,city,tags`; distance sorted by `_geo`.
  - `GET /api/search/programs` → returns program results (scaffold; wire up schema and fields during implementation).
- Scripts
  - `npm run typesense:setup` → create collections and schemas.
  - `npm run index:full` / `npm run index:delta` → push data from DB to Typesense.

---

### Version

This document reflects constitution v1.3.0. Amendments to scope or criteria should reference the updated constitution version or rationale.

## Clarifications (applied defaults)

The following clarifications resolve underspecified areas to unblock planning and testing for GS Pickleball v1.

### 1. Functional scope and UX

- Favorites: Account-based favorites; guests fall back to local storage.
- Alerts/subscriptions: Email digests (daily/weekly). Quiet hours 21:00–07:00 local. Per-category opt-out.
- Embeddable widget: Public, read-only; signed URL (TTL 1 hour). Config: location, program type, count.
- Coach inquiries: In-app inquiry form emails coach and logs activity. No long-term PII storage; 30-day retention for messages/logs.

### 2. Data model specifics

- Skill levels: USA Pickleball scale 2.0–5.0 in 0.5 increments.
- Currency: USD stored explicitly; display with "$".
- Venue hours: Support multiple intervals per day; normalize overnight spans by splitting across midnight.
- Reservation rules: `reservation_required` (bool), `method` (walk-in/phone/web/app), `url`, `phone`, `window_minutes`, `notes`.

### 3. “Open now” logic

- Time zone & DST: Derive time zone from geo; apply DST via library; compute in venue local time.
- Overnight handling: A venue is open if current local time is within any normalized interval, including split overnight.

### 4. Search semantics (Typesense)

- Default radius & sort: 25 miles (40 km). Sort by distance; tie-breaker by relevance score.
- Query fields & weights: `name^3`, `city^2`, `tags^2`, `amenities^1`.
- Typo tolerance & synonyms: Enable typo tolerance; synonyms include: pickleball/pickle ball, clinic/lesson, league/ladder.

### 5. Programs and events

- Required fields: `title`, `kind`, `level_min`, `level_max`, `start`, `end` (ISO), `price`, `location_id`, `signup_url`, `capacity`; `remaining` optional.
- Changes: `status` (scheduled/cancelled/moved); if moved, include `original_time`.

### 6. Coaches and shops

- Coach verification: `verified` after manual review; store `evidence_url` and `evidence_type`.
- Shop services taxonomy: `retail`, `stringing`, `repairs`, `demo`; allow freeform `notes`.

### 7. SEO and content

- Locality-intent pages: ≥300 words unique copy; H1 "Pickleball in {City}"; apply schema.org LocalBusiness/Place as applicable.
- Canonicals & pagination: Canonicalize filter permutations; page size 20; cap at 1000 results.

### 8. Performance and operations

- Performance documentation: Track measurements in `docs/ops/performance.md` (Lighthouse profiles and Typesense benchmarks).
- Indexing cadence: Delta job every 10 minutes with jitter; nightly reconciliation at 02:00 local.

### 9. Security and privacy

- PII handling: Mask emails/phones in logs; 30-day retention for inquiries; do not retain full message bodies beyond 30 days.
- API rate limits: Public search 60 req/min/IP; server-side (keyed) 600 req/min.

### 10. Accessibility and testing

- A11y toolchain: axe-core rules in CI plus manual keyboard checks for critical flows.
- Deterministic fixtures: `tests/fixtures/{venues,programs,coaches}.json`; include ≥10 venues (varied hours) and ≥8 programs across levels.

### Readiness for planning

All default clarifications are applied. No remaining [NEEDS CLARIFICATION]. This spec is ready for `/plan`.
