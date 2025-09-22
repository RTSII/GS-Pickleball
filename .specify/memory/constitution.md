<!--
Sync Impact Report
- Version change: 1.1.0 -> 1.2.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> Security & Secrets Hygiene (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] -> Data Model Is Source of Truth
  - [PRINCIPLE_3_NAME] -> Reliability, Tests, and Observability (TDD clarified)
  - [PRINCIPLE_4_NAME] -> Accessibility & Performance
  - [PRINCIPLE_5_NAME] -> Search as a First-Class Feature
- Added sections:
  - Mission
  - Development Workflow
  - Security & Data Handling
  - Decision Rights
  - Non‑negotiables
  - Development Guidelines
  - TDD Pathway
  - Roles
  - Review Cadence
  - Acceptance Gates
  - Appendices
- Removed sections: none
- Templates requiring updates: none detected (no templates present under .specify/templates/)
- Deferred TODOs: none
-->

# Grand Strand Pickleball Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Mission

Build the authoritative, local-first directory for pickleball on South Carolina’s
Grand Strand. Help players find where to play now, discover lessons, leagues,
clinics, tournaments, and shops, and enable venues and coaches to grow.

## Core Principles

### Security & Secrets Hygiene (NON-NEGOTIABLE)
<!-- Example: I. Library-First -->
All secrets live in `.env` (gitignored). Never commit secrets. Use service role
keys only on the server. Review environment variable usage in all routes and
scripts to ensure no secret is exposed to the browser. Rotate keys promptly if
leaked. Document required variables in `.env.example`.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### Data Model Is Source of Truth
<!-- Example: II. CLI Interface -->
Prisma schema (`prisma/schema.prisma`) drives migrations, types, and
validations. Changes originate in the schema. Each change ships with applied
migration SQL (or a Supabase SQL script) and test coverage validating behavior
and constraints.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### Reliability, Tests, and Observability
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
TDD is mandatory. Every new feature/change follows the red‑green‑refactor cycle:
write a failing test (red) → implement minimal code to pass (green) → refactor
with tests staying green. CI must typecheck, lint, test, and build. API routes
and scripts include clear logs and error context. Vitest covers key logic. Keep
flakes at zero by making tests deterministic and fast.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### Accessibility & Performance
<!-- Example: IV. Integration Testing -->
Pages pass basic a11y checks (labels, color contrast, semantics). Prefer fast,
simple UI patterns. Avoid client secrets; use server routes for integrations.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### Search as a First-Class Feature
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
Typesense collections are schema-managed and reproducible. Index scripts are
idempotent. Any data import ships with reindex steps and clear instructions.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## Development Workflow
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

Trunk-based with small PRs. Each PR must pass CI. Migrations must be applied
before merging to main. Use `.env.example` to document required variables and
keep it in sync as new features land.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Security & Data Handling
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

PII stays server-side. Never log secrets. Validate API parameters with Zod.
Enforce SSL for all database connections to Supabase. Prefer server-side
search keys; never expose admin keys to the browser.
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Decision Rights

- Product scope: Product lead decides after reviewing metrics and partner feedback.
- Data quality: Data steward owns verification SLAs and rollback decisions.
- Engineering: Tech lead owns architecture and performance budgets.
- Compliance: Legal/operations approve terms, privacy, and photo rights.

## Non‑negotiables

- Verified contact + booking links before “Book” buttons go live.
- Clear disclosure for sponsored/featured listings.
- Secure by default. Search-only keys in browser; admin keys server-only.

## Development Guidelines

- Source of truth: Supabase Postgres + PostGIS. Search is a read model in Typesense.
- Local-first data priority: Pawleys Island → Murrells Inlet → Myrtle Beach → North Myrtle Beach.
- Migrations: Prisma migrations reviewed and applied in staging before prod.
- Indexing: CDC/cron upserts to Typesense. Nightly reconciliation counts.
- Testing: Unit on all utilities; e2e for search flows and checkout; contract tests on API.
- Performance budgets: LCP < 2.0s on 4G; JS < 200KB on results pages; cached TTFB < 200ms; search P95 < 150ms.
- SEO: Programmatic city/intent pages with correct schema.org. Avoid thin content.
- Images: Only rights-cleared photos. Store consent and credits. Generate alt text on ingest.
- Change management: RFCs for schema or API breaking changes with version gates.

## TDD Pathway

- Project type: Next.js web app with API routes and background indexer scripts.
- Technology stack: Node 20, TypeScript, Next.js 14 (App Router), Prisma,
  Supabase Postgres, Typesense, Vitest.
- Test framework configuration: Vitest with Node environment, watch mode for
  local dev (`npm run test:watch`), coverage via V8 (text and HTML summary).
- Code quality tooling: ESLint + Prettier. No code merges when typecheck/lint/
  format fail. Commit small, reviewing tests first.
- CI/CD integration: GitHub Actions runs typecheck → lint → format → tests →
  build on every PR/commit to `main`. Coverage thresholds SHOULD be enforced in
  CI once the baseline suite is in place (e.g., Lines ≥70%, Branches ≥60%).
- Test patterns:
  - Unit: pure utilities (e.g., `lib/openNow.ts`), schema transforms.
  - Integration: API routes with Typesense client mocked; Prisma calls tested
    against lightweight fixtures.
  - E2E (planned): top search journeys and error/empty states.
- Mocking and fixtures: `vi.mock` for external clients (Typesense, fetch);
  fixtures in `tests/fixtures/` for venues/programs/coaches; seed minimal data
  for deterministic tests.
- Example tests guidance: include happy path, error handling (e.g., Typesense
  timeout), and edge cases (e.g., venues with overnight hours).
- Project structure (tests):
  - `tests/unit/**` — small, fast tests for pure functions
  - `tests/integration/**` — API route and indexing integration under mocks
  - `tests/fixtures/**` — JSON/TS builders for deterministic data
- Command-line scripts (standard):
  - `npm run test` — Vitest run
  - `npm run test:watch` — watch mode
  - `npm run typecheck` | `npm run lint` | `npm run format`

## Roles

Product lead, Tech lead, Data steward, Community/Partnerships, Support.

## Review Cadence

- Weekly: KPIs, incident review, backlog grooming.
- Monthly: SEO and supply coverage audits; partner satisfaction survey.

## Acceptance Gates

- MVP complete when: 75+ venues, 10+ coaches, map + facet search, “Open now”
  filter, partner intake live, core SEO pages indexed.
- Monetization ready when: Stripe subscriptions live, first 5 partners onboarded,
  program booking flow tested end‑to‑end.

## Appendices

- Licensing & Rights: Written permission from LBTS and other venues for logos,
  facility names when required, and on‑premise photos.
- Data SLA: Venues recrawled weekly, programs daily, events closed at end date.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes ad‑hoc practices. Changes require a PR with
rationale, a version bump (per semantic rules), and updates to dependent
templates or docs. CI enforces conformance where feasible.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.2.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->