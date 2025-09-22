<!--
Sync Impact Report
- Version change: (init) -> 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> Security & Secrets Hygiene (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] -> Data Model Is Source of Truth
  - [PRINCIPLE_3_NAME] -> Reliability, Tests, and Observability
  - [PRINCIPLE_4_NAME] -> Accessibility & Performance
  - [PRINCIPLE_5_NAME] -> Search as a First-Class Feature
- Added sections:
  - Development Workflow
  - Security & Data Handling
- Removed sections: none
- Templates requiring updates: none detected (no templates present under .specify/templates/)
- Deferred TODOs: none
-->

# Grand Strand Pickleball Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

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
CI must typecheck, lint, test, and build. API routes and scripts include clear
logs and error context. Vitest covers key logic. Keep flakes at zero by making
tests deterministic and fast.
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

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes ad‑hoc practices. Changes require a PR with
rationale, a version bump (per semantic rules), and updates to dependent
templates or docs. CI enforces conformance where feasible.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->