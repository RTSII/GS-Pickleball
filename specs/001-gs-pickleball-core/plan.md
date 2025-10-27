# GS Pickleball Core — Implementation Plan

> **Governance**: This plan aligns with the canonical constitution at
> `.specify/memory/constitution.md` (v1.3.0) and canonical spec at `docs/specify.md`.
>
> **Status**: Updated 2025-10-27 with current implementation state.

## Executive Summary

Build the core search and discovery platform for pickleball venues, programs, and coaches on South Carolina's Grand Strand. Implementation follows TDD principles with a mobile-first, accessible design and robust search infrastructure.

## Current Implementation Status (as of 2025-10-27)

### ✅ COMPLETED
- **Database & Schema**
  - Prisma schema complete with all entities (Venue, Court, Program, Coach, Shop, Event, Photo, Claim, Review)
  - PostGIS migration applied (`0001_postgis/steps.sql`) with computed `geog` column and GiST index
  - Migrations stable and ready for production

- **Search Infrastructure**
  - Typesense collections defined for venues, programs, coaches
  - Full reindex script (`scripts/reindex.ts`) functional
  - Delta indexer (`scripts/changed-since.ts`) ready with LOOKBACK_MINUTES
  - `lib/openNow.ts` utility handles timezone-aware hours with overnight windows

- **API Endpoints**
  - `GET /api/search/venues` — Zod validation, distance sorting, facets (indoor, lights, open_now)
  - `GET /api/search/programs` — Zod validation, level filtering, kind facets

- **Testing Framework**
  - Vitest configured with coverage thresholds (Lines ≥70%, Branches ≥60%, Functions ≥70%, Statements ≥70%)
  - 12 tests passing across 5 test files
  - Test fixtures for crawler, normalizer, verifier
  - TypeScript checks passing with no errors

- **Data Pipeline Foundations**
  - Crawler parser scaffold (`scripts/crawlers/visit-mb/parse.ts`)
  - Normalizer scaffold (`scripts/normalizer/venue.ts`) with fee parsing
  - Email template utilities (`scripts/verifier/email-template.ts`)
  - Tests passing for all scaffolds

- **CI/CD**
  - GitHub Actions workflow (`.github/workflows/ci.yml`) running: typecheck → lint → format → tests → build
  - Git hooks configured

### 🚧 IN PROGRESS / NEEDS COMPLETION

- **Frontend UI**
  - Basic test page at `/` (app/page.tsx) — needs map integration
  - No detail pages (venue, program, coach)
  - No error/empty state components
  - Missing facet UI components

- **Data Seeding**
  - No seed data in database
  - No test fixtures for realistic venue/program data

- **Environment Setup**
  - `.env.example` documented but no validation that required vars are set

- **Crawlers**
  - Visit-MB parser is minimal — needs full implementation
  - No actual Playwright crawler implemented
  - No other source crawlers

- **Indexing Pipeline**
  - Scripts exist but not tested end-to-end with real data
  - No cron/scheduled job configured

### ❌ NOT STARTED

- **Maps & Clustering**
  - Mapbox integration
  - Cluster visualization
  - Bounds-based filtering

- **Detail Pages**
  - Venue detail pages
  - Program detail pages
  - Coach detail pages

- **User Features**
  - Favorites (local storage or account-based)
  - Email alerts/subscriptions
  - Public submission forms
  - Claim listing workflow

- **Monetization**
  - Stripe integration
  - Partner widgets
  - Featured listings

- **SEO**
  - Locality-intent pages (Pawleys, Murrells, Myrtle, NMB)
  - Schema.org markup
  - Sitemap generation

- **Observability**
  - Error tracking (Sentry)
  - Performance monitoring
  - Uptime alerts
  - Index drift alerts

## Technology Stack

### Core
- **Web**: Next.js 14 (App Router), React 18, TypeScript 5
- **Database**: Supabase Postgres + PostGIS + Prisma ORM
- **Search**: Typesense Cloud (venues, programs, coaches collections)
- **Maps**: Mapbox GL (planned)
- **Testing**: Vitest + V8 coverage
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel-ready

### Dependencies
- `@prisma/client` ^5.18.0
- `@supabase/supabase-js` ^2.45.4
- `next` ^14.2.5
- `typesense` ^1.8.2
- `zod` ^3.23.8

## Architecture

### Data Flow
```
User Request
    ↓
Next.js API Route (Zod validation)
    ↓
Typesense Cloud (search/filter)
    ↓
Response with hits
    ↓
UI renders results
```

### Indexing Pipeline
```
Supabase Postgres (source of truth)
    ↓
Indexer Scripts (reindex.ts / changed-since.ts)
    ↓
Transform: add _geo, open_now, facets
    ↓
Typesense Collections (search index)
```

### Security Model
- **Admin keys**: Server-only (`TYPESENSE_ADMIN_KEY`)
- **Search keys**: Server-preferred (`TYPESENSE_SEARCH_KEY`)
- **Browser keys**: Optional (`NEXT_PUBLIC_TYPESENSE_SEARCH_KEY`)
- **Database**: SSL-enforced connections

## Implementation Phases

### Phase 1: Core Search & Discovery (Weeks 1-3) — 70% Complete

**Goal**: Functional search with map, filters, and detail pages

#### Remaining Tasks:
1. **Data Seeding** (Priority: HIGH)
   - Create seed script with ≥10 venues (varied hours, locations)
   - Add ≥8 programs across skill levels
   - Add ≥2 coaches
   - Validate data through Prisma

2. **Map Integration** (Priority: HIGH)
   - Add Mapbox GL to app/page.tsx
   - Implement clustering for venues
   - Distance-based result sorting
   - Sync map bounds with results

3. **Detail Pages** (Priority: HIGH)
   - Venue page: hours, amenities, fees, booking links, parking notes
   - Program page: level bands, dates, price, signup
   - Coach page: credentials, rates, inquiry CTA
   - Implement "open now" badge logic

4. **Error & Empty States** (Priority: MEDIUM)
   - Search failures with retry
   - No results state with suggestions
   - Geo permission denied fallback
   - Offline banner

5. **Performance Validation** (Priority: HIGH)
   - Verify P95 search latency ≤150ms
   - LCP ≤2.0s on 4G throttle
   - Run Lighthouse CI

**Success Criteria**:
- Users can search venues by location with filters
- Map shows clustered results
- Detail pages load with all required fields
- Performance budgets met

### Phase 2: Data Operations (Weeks 4-6) — 20% Complete

**Goal**: Automated data collection and verification

#### Tasks:
1. **Crawler Implementation**
   - Playwright-based Visit-MB crawler
   - Additional sources: NMB, Litchfield Pickleball, LBTS
   - robots.txt compliance and rate limiting
   - Error handling and retry logic

2. **Normalizer Enhancement**
   - Geocoding integration (Nominatim or Mapbox)
   - Hours normalization and validation
   - Deduplication logic (fuzzy match + geo)
   - Confidence scoring

3. **Verifier System**
   - Phone/email verification queue
   - Call script generation
   - Response tracking
   - Human approval workflow

4. **Indexing Automation**
   - Schedule delta indexing (every 10 min)
   - Nightly reconciliation
   - Drift detection and alerts
   - Logging and metrics

**Success Criteria**:
- ≥75 venues listed across Grand Strand
- ≥60% verified through contact
- Nightly jobs running with <1% drift
- Coverage map shows good density

### Phase 3: User Features & Engagement (Weeks 7-9) — 0% Complete

**Goal**: User accounts, favorites, alerts

#### Tasks:
1. **Account System**
   - Supabase Auth (email/password)
   - Profile pages
   - RLS policies

2. **Favorites**
   - Account-based favorites
   - Local storage fallback for guests
   - Sync on login

3. **Alerts/Subscriptions**
   - Email digest system
   - Per-category opt-out
   - Quiet hours (21:00-07:00 local)

4. **Public Submission**
   - Venue submission form
   - hCaptcha integration
   - Moderation queue

**Success Criteria**:
- Users can create accounts
- Favorites persist across sessions
- Email alerts working
- ≥10 user submissions per week

### Phase 4: Monetization & Partners (Weeks 10-12) — 0% Complete

**Goal**: Revenue streams and partner tools

#### Tasks:
1. **Stripe Integration**
   - Subscription tiers (Basic/Featured/Plus)
   - Webhook handling
   - Dunning emails
   - Invoice generation

2. **Featured Listings**
   - Badge/highlighting in search
   - Priority sorting
   - Analytics dashboard for partners

3. **Partner Widgets**
   - Embeddable program schedules
   - Signed URLs with TTL
   - CORS configuration
   - Installation docs

4. **LBTS & Litchfield Integration**
   - Custom landing pages
   - Photo rights confirmed
   - Co-branded content

**Success Criteria**:
- ≥5 paying partners
- Widget installed on ≥2 partner sites
- Stripe webhooks handling subscriptions
- LBTS partnership active

### Phase 5: SEO & Growth (Ongoing) — 0% Complete

**Goal**: Organic traffic and discovery

#### Tasks:
1. **Locality Pages**
   - Pawleys Island, Murrells Inlet, Myrtle Beach, NMB
   - ≥300 words unique content per page
   - Schema.org LocalBusiness markup

2. **Sitemap & Robots**
   - Dynamic sitemap.xml
   - robots.txt optimization
   - Canonical URLs

3. **Performance Optimization**
   - Image optimization
   - Code splitting
   - CDN configuration
   - Cache headers

4. **Analytics**
   - Google Analytics / Plausible
   - Conversion tracking
   - Funnel analysis

**Success Criteria**:
- 4 locality pages indexed
- Organic search traffic ≥100/week
- LCP ≤2.0s maintained
- Conversion rate ≥25% (venue → booking click)

## Performance Budgets

### Latency
- Search API P95: ≤150ms
- Search API P99: ≤300ms
- TTFB (cached): ≤200ms

### Core Web Vitals
- LCP: ≤2.0s on 4G
- CLS: ≤0.1
- INP: ≤200ms

### Bundle Sizes
- Initial JS: ≤200KB
- Results page JS: ≤200KB

## Testing Strategy

### Unit Tests
- Pure utilities (`lib/openNow.ts`)
- Schema transforms
- Parser functions
- **Coverage Target**: Lines ≥70%, Branches ≥60%, Functions ≥70%, Statements ≥70%

### Integration Tests
- API routes with mocked Typesense
- Prisma calls with lightweight fixtures
- Crawler with saved HTML fixtures

### E2E Tests (Future)
- Critical search journeys
- Error/empty states
- Booking flow

### Test Fixtures
- Location: `tests/fixtures/`
- Venues: 10 with varied hours (including overnight)
- Programs: 8 across skill levels
- HTML samples for crawlers

## Security & Compliance

### Secrets Management
- All secrets in `.env` (gitignored)
- `.env.example` documents required vars
- Rotate keys on suspected leak
- No secrets in logs or client code

### Data Privacy
- PII masked in logs
- 30-day retention for inquiries
- User opt-in for emails
- GDPR-ready data exports

### API Security
- Rate limiting: 60 req/min/IP (public), 600 req/min (server)
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS prevention via React

## Observability

### Metrics (Future)
- Search latency (P50, P95, P99)
- Error rates by endpoint
- Index freshness lag
- User engagement (CTR, dwell time)

### Logging (Future)
- Correlation IDs
- Structured logs (JSON)
- Centralized (Logtail or similar)
- PII scrubbing

### Alerts (Future)
- Search API down >5min
- Index drift >1%
- Error rate >5% sustained
- Performance degradation

## Deployment

### Environments
- **Development**: Local (Typesense Docker)
- **Staging**: Vercel Preview + Typesense Cloud
- **Production**: Vercel + Typesense Cloud + Supabase Production

### Environment Variables
See `.env.example` for complete list:
- Supabase: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Typesense: `TYPESENSE_HOST`, `TYPESENSE_PORT`, `TYPESENSE_PROTOCOL`, `TYPESENSE_ADMIN_KEY`, `TYPESENSE_SEARCH_KEY`
- Mapbox: `MAPBOX_TOKEN`
- Indexer: `LOOKBACK_MINUTES`

### Deployment Checklist
1. Set all env vars in Vercel
2. Run `npm run typesense:setup` (one-time)
3. Seed initial data
4. Run `npm run index:full`
5. Deploy to Vercel
6. Verify health checks
7. Set up monitoring

## Risk Register

### Technical Risks
- **Typesense outage**: Implement retry with exponential backoff; consider fallback to Postgres full-text search
- **PostGIS performance**: Monitor slow queries; add indexes as needed
- **Stale search index**: Automate drift detection; alert on >1% divergence

### Data Risks
- **Inaccurate hours**: Verification system + claim workflow
- **Duplicate venues**: Normalizer with fuzzy matching
- **Copyright issues**: Photo rights tracking; DMCA process

### Business Risks
- **Low partner adoption**: Freemium model with clear value props
- **Seasonality**: Adjust marketing by season; promote indoor venues in off-season

## Next Steps (Immediate)

**Priority Order**:
1. **Data Seeding** — Create seed script with realistic data
2. **End-to-End Test** — Run full indexing pipeline and verify search works
3. **Map Integration** — Add Mapbox with clustering
4. **Detail Pages** — Venue, program, coach pages
5. **Performance Validation** — Run Lighthouse and verify budgets

**Unblock Development**:
- Ensure `.env` has all required values
- Run `npm run typesense:setup` locally
- Create seed data script
- Test full pipeline: seed → index → search

## Reference Links

- **Constitution**: `.specify/memory/constitution.md` (v1.3.0)
- **Canonical Spec**: `docs/specify.md`
- **Data Model**: `specs/001-gs-pickleball-core/data-model.md`
- **API Contracts**: `specs/001-gs-pickleball-core/contracts/`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Agent SOPs**: `docs/agents/`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-27
**Status**: Active Development