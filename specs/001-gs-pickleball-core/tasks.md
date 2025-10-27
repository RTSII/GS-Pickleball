# GS Pickleball Core — Actionable Tasks

> **Governance**: Tasks derived from `plan.md` and aligned with constitution v1.3.0.
>
> **Status**: Updated 2025-10-27 with current progress and next steps.

## Current Progress Summary

**Phase 1 (Core Search & Discovery)**: 70% Complete
- ✅ Database schema & migrations
- ✅ Search infrastructure & API endpoints
- ✅ Testing framework & CI/CD
- 🚧 Data seeding needed
- 🚧 Map UI incomplete
- 🚧 Detail pages missing

**Next Immediate Priority**: Data Seeding → End-to-End Testing → Map Integration

---

## Phase 1: Core Search & Discovery (ACTIVE)

### ✅ COMPLETED TASKS

**1. Bootstrap repo and environment**
   - Status: DONE
   - Output: Next.js 14 app, Prisma configured, CI active
   - Tests: 12 passing across 5 test files

**2. Enable database extensions**
   - Status: DONE
   - Output: PostGIS and uuid-ossp enabled in Supabase
   - Files: `sql/0000_enable_extensions.sql`

**3. Apply Prisma schema and migrations**
   - Status: DONE
   - Output: All entities migrated, PostGIS `geog` column with GiST index
   - Files: `prisma/schema.prisma`, `prisma/migrations/0001_init/`, `prisma/migrations/0001_postgis/`

**5. Provision Typesense collections**
   - Status: DONE
   - Output: Collections defined for venues, programs, coaches
   - Files: `scripts/typesense-setup.ts`
   - Command: `npm run typesense:setup`

**8. Implement Venues Search API**
   - Status: DONE
   - Output: `/api/search/venues` with Zod validation, facets, distance sorting
   - Files: `app/api/search/venues/route.ts`
   - Tests: Integration tests needed

**9. Implement Programs Search API**
   - Status: DONE
   - Output: `/api/search/programs` with level filtering
   - Files: `app/api/search/programs/route.ts`
   - Tests: Integration tests needed

### 🔥 HIGH PRIORITY (DO NEXT)

**4. Create seed data script** [BLOCKED: Development]
   - Priority: CRITICAL
   - Estimate: 2-3 hours
   - Dependencies: None (DB ready)
   - Acceptance Criteria:
     - ≥10 venues with varied locations (Pawleys, Murrells, Myrtle, NMB)
     - Venues have realistic hours (include overnight cases)
     - ≥8 programs across skill levels (2.0-5.0)
     - ≥2 coaches with credentials
     - All data validates against Prisma schema
   - Files to Create: `scripts/seed.ts`
   - Command: `npm run seed` (add to package.json)
   - Test Plan:
     - Run seed script
     - Verify data in Supabase dashboard
     - Query venues/programs/coaches via Prisma
   - References: `docs/specify.md` § Data model

**6. Full reindex and validation** [BLOCKED BY: Task 4]
   - Priority: HIGH
   - Estimate: 1 hour
   - Dependencies: Task 4 (seed data)
   - Acceptance Criteria:
     - `npm run index:full` completes without errors
     - All seeded venues appear in Typesense with correct `_geo` and `open_now`
     - Programs indexed with correct `level_min`, `level_max`, `start_ts`
     - Drift check shows <1% divergence
     - Logs written to `logs/` directory
   - Command: `npm run index:full`
   - Test Plan:
     - Check Typesense collection counts match DB counts
     - Search for venues by name and verify results
     - Filter by facets (indoor, lights, open_now)
     - Verify distance sorting works
   - References: `scripts/reindex.ts`

**6b. End-to-end search validation** [BLOCKED BY: Task 6]
   - Priority: HIGH
   - Estimate: 1 hour
   - Dependencies: Task 6 (full reindex)
   - Acceptance Criteria:
     - `/api/search/venues?lat=33.462&lng=-79.121&indoor=true` returns results
     - `/api/search/programs?kind=lesson&level=3.0` filters correctly
     - Typo tolerance works (`q=pikleball`)
     - P95 latency ≤150ms (measure with 20 sequential requests)
   - Test Plan:
     - Use curl or Postman to test API endpoints
     - Verify response structure matches contracts
     - Check performance with `time` command
   - References: `specs/001-gs-pickleball-core/quickstart.md`

### 📋 MEDIUM PRIORITY

**10. Map + list UI with Mapbox** [BLOCKED BY: Task 6b]
   - Priority: MEDIUM
   - Estimate: 4-6 hours
   - Dependencies: Task 6b (working search)
   - Acceptance Criteria:
     - Mapbox GL integrated in `app/page.tsx`
     - Venues displayed as clustered markers
     - Click marker → show venue card
     - Results list syncs with map bounds
     - Facet filters (indoor, lights, open_now) update map and list
     - Mobile responsive
   - Files to Modify: `app/page.tsx`
   - Libraries: `mapbox-gl`, `react-map-gl`
   - Test Plan:
     - Zoom/pan updates results
     - Toggle filters updates markers
     - Click marker shows correct venue
   - References: `docs/specify.md` § Search & filters

**11. Venue detail pages** [Can parallelize with Task 10]
   - Priority: MEDIUM
   - Estimate: 3-4 hours
   - Dependencies: Task 4 (seed data)
   - Acceptance Criteria:
     - Route: `/venues/[id]`
     - Display: name, address, hours, amenities, fees, booking link, parking notes
     - "Open now" badge shown if `isOpenNow()` returns true
     - Hide badge if `hoursJson` is null
     - Booking link validated (200 OK or mailto/tel)
     - Mobile responsive
   - Files to Create: `app/venues/[id]/page.tsx`
   - Test Plan:
     - Navigate to venue from search results
     - Verify all fields display correctly
     - Test "open now" logic at different times
     - Click booking link works
   - References: `docs/specify.md` § Venue pages

**12. Program and Coach detail pages** [Can parallelize with Task 10]
   - Priority: MEDIUM
   - Estimate: 3-4 hours
   - Dependencies: Task 4 (seed data)
   - Acceptance Criteria:
     - Program route: `/programs/[id]`
       - Display: kind, level band, dates, price, signup URL, venue link
     - Coach route: `/coaches/[id]`
       - Display: name, credentials, rate, cities served, inquiry CTA
     - Mobile responsive
   - Files to Create:
     - `app/programs/[id]/page.tsx`
     - `app/coaches/[id]/page.tsx`
   - Test Plan:
     - Navigate from search results
     - Verify level filtering logic
     - Test inquiry form (future: can be placeholder CTA for now)
   - References: `docs/specify.md` § Programs and coaches

**13. Error and empty states** [Can parallelize]
   - Priority: MEDIUM
   - Estimate: 2-3 hours
   - Dependencies: Task 10 (map UI)
   - Acceptance Criteria:
     - Search fails → show error with "Retry" button
     - No results → show empty state with "broaden radius" suggestion + top 4 nearby courts
     - Geo denied → fallback to manual entry, default to Myrtle Beach
     - Offline → banner "You are offline—data may be outdated"
   - Files to Create/Modify:
     - `app/components/ErrorState.tsx`
     - `app/components/EmptyState.tsx`
     - `app/page.tsx` (integrate states)
   - Test Plan:
     - Simulate Typesense timeout
     - Search with no matches
     - Block geolocation
     - Go offline (DevTools)
   - References: `docs/specify.md` § Error states

### ⏰ LOW PRIORITY (Phase 1 completion)

**7. Schedule delta indexer job**
   - Priority: LOW (for Phase 1; needed for production)
   - Estimate: 2 hours
   - Dependencies: Task 6 (full reindex working)
   - Acceptance Criteria:
     - Cron job or scheduled function runs `npm run index:delta` every 10 minutes
     - Uses `LOOKBACK_MINUTES=10` env var
     - Logs to centralized location
     - Alerts if errors >5%
   - Options:
     - Vercel Cron Jobs
     - Railway/Fly.io cron
     - GitHub Actions scheduled workflow
   - Test Plan:
     - Update a venue in DB
     - Wait 10 minutes
     - Verify Typesense index updated
   - References: `scripts/changed-since.ts`

**16. Performance validation**
   - Priority: LOW (but measure early)
   - Estimate: 2 hours
   - Dependencies: Task 10 (map UI)
   - Acceptance Criteria:
     - Lighthouse CI configured
     - Search API P95 ≤150ms (test with 100 requests)
     - LCP ≤2.0s on 4G throttle
     - CLS ≤0.1
     - INP ≤200ms
   - Tools: Lighthouse CLI, k6 or Apache Bench
   - Test Plan:
     - Run Lighthouse on `/` and venue pages
     - Load test search API
     - Document results in `docs/performance.md`
   - References: `docs/specify.md` § Performance budgets

---

## Phase 2: Data Operations (NOT STARTED)

**Priority**: Start after Phase 1 reaches 90%

### Tasks (Brief overview)

**20. Implement Playwright crawler for Visit-MB**
   - Estimate: 6-8 hours
   - Files: `scripts/crawlers/visit-mb/crawl.ts`
   - Dependencies: Playwright installed

**21. Enhance normalizer with geocoding**
   - Estimate: 4-6 hours
   - Files: `scripts/normalizer/venue.ts` (enhance existing)
   - Dependencies: Nominatim or Mapbox Geocoding API

**22. Build verifier queue system**
   - Estimate: 6-8 hours
   - Files: `scripts/verifier/queue.ts`, email templates
   - Dependencies: Email service (SendGrid or similar)

**23. Nightly reconciliation job**
   - Estimate: 3-4 hours
   - Dependencies: Delta indexer (Task 7)

---

## Phase 3: User Features (NOT STARTED)

**Priority**: Start Week 7

### Tasks (Brief overview)

**30. Supabase Auth integration**
**31. Favorites system**
**32. Email alerts**
**33. Public submission form**

---

## Phase 4: Monetization (NOT STARTED)

**Priority**: Start Week 10

### Tasks (Brief overview)

**40. Stripe subscriptions**
**41. Featured listings**
**42. Partner widgets**
**43. LBTS partnership pages**

---

## Phase 5: SEO & Growth (ONGOING)

**Priority**: Incremental; start after Phase 1

### Tasks (Brief overview)

**50. Locality-intent pages** (Pawleys, Murrells, Myrtle, NMB)
**51. Sitemap generation**
**52. Schema.org markup**
**53. Analytics setup**

---

## Testing Checklist

### Current Test Coverage: 12 tests passing
- ✅ `lib/openNow.ts` — 9 tests (4 in tests/unit/, 5 in tests/)
- ✅ Crawler parser — 1 test
- ✅ Normalizer — 1 test
- ✅ Verifier email template — 1 test

### Needed Tests (Add as you build)
- [ ] API route integration tests (venues, programs)
- [ ] Venue detail page rendering
- [ ] Program detail page with level filtering
- [ ] Coach detail page
- [ ] Error/empty state components
- [ ] Map clustering logic
- [ ] Search result synchronization

### Coverage Targets (vitest.config.ts)
- Lines: ≥70%
- Branches: ≥60%
- Functions: ≥70%
- Statements: ≥70%

---

## Development Commands Reference

```bash
# Database
npm run typecheck          # Check TypeScript
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Apply migrations

# Search
npm run typesense:setup    # Create collections (one-time)
npm run index:full         # Full reindex
npm run index:delta        # Delta reindex (LOOKBACK_MINUTES)

# Testing
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run lint               # ESLint
npm run format             # Prettier check

# Development
npm run dev                # Start dev server (localhost:3000)
npm run build              # Production build
```

---

## Unblocking Checklist

Before starting development, ensure:
- [ ] `.env` file created from `.env.example`
- [ ] All required env vars set (Supabase, Typesense, Mapbox)
- [ ] Supabase project created and extensions enabled
- [ ] Typesense cluster provisioned (Cloud or local Docker)
- [ ] `npm install` completed
- [ ] `npx prisma generate` completed
- [ ] Migrations applied to Supabase

---

## References

- **Plan**: `specs/001-gs-pickleball-core/plan.md`
- **Spec**: `docs/specify.md`
- **Constitution**: `.specify/memory/constitution.md` (v1.3.0)
- **Architecture**: `docs/ARCHITECTURE.md`
- **Data Model**: `specs/001-gs-pickleball-core/data-model.md`
- **API Contracts**: `specs/001-gs-pickleball-core/contracts/`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-27
**Next Review**: After Task 6b completion
