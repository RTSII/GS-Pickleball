# Implementation Plan: GS Pickleball v1 Core

**Branch**: `002-gs-pickleball-v1` | **Date**: 2025-09-24 | **Spec**: specs/002-gs-pickleball-v1/spec.md

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
6. Execute Phase 1 → contracts, data-model.md, quickstart.md
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary

From the feature spec, v1 delivers:

- Map + list search with facets (indoor, lights, open-now, fees, lessons)
- Venue detail with hours, amenities, fee range, booking/contact
- Program discovery with level/date/price filters
- Coach directory with inquiry CTA
- Calendar export (iCal)
- Favorites (account-based; guest fallback) and email alerts (daily/weekly)
- Search-first UX with typo tolerance, synonyms, and geo distance sorting

Technical approach will use the project’s standard architecture (Next.js App Router, API routes, Typesense search index and Supabase as source of truth) per constitution v1.3.0.

## Cross-References (starter docs)

- Source: `starter docs/research.md`  
  Incorporated into this plan and the feature research:
  - Version Pins (frameworks, server/client libraries)
  - Vendor Choices (Search, Hosting, Email, Payments) with alternatives
  - Decision Records (cron indexing, auth mode, no semantic search, PgBouncer username, Node pin, Typesense envs)
  - Gap Log (open items) and Benchmarks
- Source: `starter docs/tasks.md`  
  Acknowledged for Phase 0 bootstrap and CI/Governance expectations. Use as a reference when aligning setup steps and pipelines.

## Technical Context

**Language/Version**: TypeScript on Node 20  
**Primary Dependencies**: Next.js 14 (App Router), Prisma, Supabase Postgres + PostGIS, Typesense, Vitest  
**Storage**: Supabase Postgres (canonical), Typesense (read model)  
**Testing**: Vitest (unit/integration), future E2E  
**Target Platform**: Web application (frontend + API routes)  
**Project Type**: web  
**Performance Goals**: LCP ≤2.0s (4G), `/api/search/venues` p95 ≤150ms  
**Constraints**: Search-only key in browser; admin/server keys server-side only  
**Scale/Scope**: Local-first GS region; ≥75 venues, ≥100 active programs

## Constitution Check

- Security & Secrets Hygiene:  
  - No admin keys in browser; `.env.example` documents required env.  
  - SSL enforced for DB connections.  
- Data Model Is Source of Truth:  
  - Prisma schema drives migrations and types.  
- Reliability, Tests, Observability (TDD):  
  - Red–green–refactor; CI enforces typecheck/lint/test/build.  
- Accessibility & Performance:  
  - A11y checks; performance budgets (LCP, TTFB).  
- Search as a First‑Class Feature:  
  - Managed Typesense schemas; reproducible indexing; delta and nightly jobs.

Status: No violations identified at plan time; validate during implementation checkpoints.

## Project Structure

### Documentation (this feature)

```text
specs/002-gs-pickleball-v1/
├── plan.md              # This file (/plan output)
├── research.md          # Phase 0 output (/plan)
├── data-model.md        # Phase 1 output (/plan)
├── quickstart.md        # Phase 1 output (/plan)
└── contracts/           # Phase 1 output (/plan)
```

### Source Code (repository root)

```text
# Web application
app/                     # Next.js App Router
lib/                     # Utilities, helpers
scripts/                 # Indexing and ops scripts
```

**Structure Decision**: Web application (Next.js App Router + API routes)

## Phase 0: Outline & Research

1. Extract unknowns from Technical Context and Spec:
   - Verify Geo → Timezone mapping library and DST handling approach.  
   - Confirm default geo radius (25 miles) and tie-breakers in Typesense config.  
   - Validate synonyms list and misspelling tolerance policy.  
   - Confirm email alert cadence and quiet hours policy.  
   - Verify program required fields and validation rules.  
2. Generate research tasks and consolidate into research.md with decisions, rationale, alternatives.

  Output: research.md
  
  Reference: See `starter docs/tasks.md` for bootstrap and CI/Governance setup inputs.

## Phase 1: Design & Contracts

1. Data model outline → data-model.md (entities, fields, relationships).  
2. Contracts: endpoints for search, programs, venues (OpenAPI/JSON outlines) under contracts/.  
3. Quickstart: end-to-end validation steps → quickstart.md.  
4. Update agent file incrementally if applicable (not required for Windsurf).

Outputs: data-model.md, contracts/*, quickstart.md

## Phase 2: Task Planning Approach (describe only)

- Load `.specify/templates/tasks-template.md` as base.  
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart).  
- TDD order: tests before implementation; mark [P] for parallel when files are independent.

Estimated Output: 25–30 tasks in tasks.md (created by /tasks command)

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Progress Tracking

**Phase Status**:  
- [x] Phase 0: Research complete (/plan)  
- [x] Phase 1: Design complete (/plan)  
- [x] Phase 2: Task planning approach drafted (/plan)  
- [x] Phase 3: Tasks generated (/tasks)  
- [ ] Phase 4: Implementation complete  
- [ ] Phase 5: Validation passed  

**Gate Status**:  
- [x] Initial Constitution Check: PASS  
- [x] Post-Design Constitution Check: PASS  
- [x] All NEEDS CLARIFICATION resolved  
- [x] Complexity deviations documented (none)  

---  
*Based on Constitution v1.3.0 - See `.specify/memory/constitution.md`*
