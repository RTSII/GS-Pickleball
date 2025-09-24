# Tasks: GS Pickleball v1 Core

**Input**: Design documents from `specs/002-gs-pickleball-v1/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```text
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, API routes
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 0: Setup
- [ ] T001 Pin Node to 20.18.x and verify CI installs  
      Path: `.nvmrc`, `.github/workflows/ci.yml`
- [ ] T002 Update `.env.example` with required keys (Supabase, Typesense, Mapbox)  
      Path: `.env.example`, `README.md`
- [ ] T003 [P] Add Typesense setup script and verify health  
      Path: `scripts/typesense-setup.ts`, `package.json` scripts
- [ ] T004 [P] Add index scripts (full, delta) with config knobs  
      Path: `scripts/index-full.ts`, `scripts/index-delta.ts`

## Phase 1: Tests First (TDD)
- [ ] T005 Create deterministic fixtures  
      Path: `tests/fixtures/{venues,programs,coaches}.json`
- [ ] T006 [P] Contract test: GET /api/search/venues  
      Path: `tests/contract/search.test.ts`
- [ ] T007 [P] Contract test: GET /api/search/programs  
      Path: `tests/contract/programs.test.ts`
- [ ] T008 [P] Integration test: open-now filter behavior  
      Path: `tests/integration/search_open_now.test.ts`
- [ ] T009 [P] Integration test: program filters (level/date/price)  
      Path: `tests/integration/program_filters.test.ts`
- [ ] T010 [P] Integration test: favorites (auth + guest fallback)  
      Path: `tests/integration/favorites.test.ts`
- [ ] T011 [P] Integration test: iCal export validates in parsers  
      Path: `tests/integration/ical_export.test.ts`

## Phase 2: Core Implementation (ONLY after tests are failing)
- [ ] T012 Prisma models for Venue, Court, Program, Coach, Shop, Event  
      Path: `prisma/schema.prisma`
- [ ] T013 Add spatial column/index for Venue (geog + GiST) and migrate  
      Path: `prisma/migrations/*`
- [ ] T014 Seed baseline data (10 venues, 8 programs, 2 coaches)  
      Path: `prisma/seed.ts`
- [ ] T015 API route: GET /api/search/venues (facets + distance sort)  
      Path: `app/api/search/venues/route.ts`
- [ ] T016 API route: GET /api/search/programs (level/date/price filters)  
      Path: `app/api/search/programs/route.ts`
- [ ] T017 Implement open-now utility (TZ/DST/overnight aware)  
      Path: `lib/openNow.ts`
- [ ] T018 Implement Typesense relevance config (fields/weights/synonyms)  
      Path: `scripts/typesense-setup.ts`
- [ ] T019 Full and delta index jobs (idempotent; drift-safe)  
      Path: `scripts/index-full.ts`, `scripts/index-delta.ts`

## Phase 3: Web App
- [ ] T020 Map + list UI with clustering and facets  
      Path: `app/(public)/search/page.tsx`, `components/Map.tsx`, `components/Filters.tsx`
- [ ] T021 Venue page (amenities, fees, booking/contact, hours)  
      Path: `app/(public)/venue/[id]/page.tsx`
- [ ] T022 Programs view and Coach directory  
      Path: `app/(public)/programs/page.tsx`, `app/(public)/coaches/page.tsx`
- [ ] T023 Favorites (account-based + guest local storage fallback)  
      Path: `lib/favorites.ts`, `app/(public)/*`
- [ ] T024 iCal export for programs/events  
      Path: `lib/ical.ts`

## Phase 4: Integration & Ops
- [ ] T025 Nightly reconciliation and dead-link checker  
      Path: `scripts/reconcile-nightly.ts`, `scripts/check-dead-links.ts`
- [ ] T026 [P] Logging and error handling middleware  
      Path: `lib/logging.ts`, `app/middleware.ts`
- [ ] T027 [P] Observability dashboards and alerts (search P95, drift)  
      Path: `docs/ops/observability.md`
- [ ] T028 [P] Performance docs and Lighthouse profiles  
      Path: `docs/ops/performance.md`

## Phase 5: Polish
- [ ] T029 [P] Unit tests for utilities (openNow, validators)  
      Path: `tests/unit/*.test.ts`
- [ ] T030 [P] Accessibility checks (axe-core) + keyboard journeys  
      Path: `tests/integration/a11y.test.ts`
- [ ] T031 Update README and docs (API, setup, indexing)  
      Path: `README.md`, `docs/`

## Dependencies
- Tests (T005–T011) before implementation (T012–T019)
- T012 blocks T013–T016
- T017 blocks T015 open-now assertions
- T018 blocks T019

## Parallel Example
```text
# Launch T006–T011 together:
Contract test: GET /api/search/venues
Contract test: GET /api/search/programs
Integration: open-now filter
Integration: program filters
Integration: favorites
Integration: iCal export
```

## Validation Checklist
- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
