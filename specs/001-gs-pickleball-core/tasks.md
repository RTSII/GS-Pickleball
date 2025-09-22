# Step 3: Generate executable tasks (5 minutes)
/tasks

# This automatically creates:
# - specs/001-gs-pickleball-core/tasks.md (this file)

> Inputs: reads `plan.md` (required). Converts contracts, entities, and scenarios into tasks. Marks [P] for parallelizable items.

## Parallel groups
- **Group A [P]:** Search cluster (Typesense), Seed data, API scaffolding
- **Group B [P]:** Map UI, Venue/Program pages, Error/empty states
- **Group C [P]:** Observability, A11y/SEO, Performance budgets

## Task list (ordered with references)

1. Bootstrap repo and env (Spec § Summary; Plan § Executable sequence 0)  
   - Create Next.js app, install deps, copy `.env.example`.  
   - Output: initial commit, CI hooks active.

2. Enable DB extensions (Plan § Executable sequence 1–2)  
   - Run `sql/0000_enable_extensions.sql` in Supabase.  
   - Verify `postgis` and `uuid-ossp` enabled.

3. Apply Prisma schema and migrate (Spec § Data model; Plan § Executable 3–4)  
   - Replace `prisma/schema.prisma`; run `prisma migrate dev`.  
   - Run PostGIS `steps.sql` to add `geog` and GiST.  
   - Output: DB ready with spatial index.

4. Seed minimal data [P] (Plan § Executable 2, 5)  
   - Insert ≥10 venues, ≥2 coaches with hours.  
   - Output: smoke data present.

5. Provision Typesense Cloud [P] (Plan § Executable 6)  
   - Create cluster and keys. Run `/scripts/typesense-setup.ts`.  
   - Output: `venues`, `programs`, `coaches` collections exist.

6. Full reindex and drift check [P] (Plan § Executable 7)  
   - Run `/scripts/reindex.ts`; compare counts with DB.  
   - If drift >1%, log gap in `research.md` (§ Gap log).

7. Schedule delta job (Plan § Executable 8)  
   - Run `/scripts/changed-since.ts` every 10 minutes.  
   - Output: cron or scheduled function configured.

8. Implement Venues API (contracts/venues.md; Plan § API contracts)  
   - Build `/api/search/venues` with zod validation and Typesense client.  
   - Add unit and contract tests from `contracts/venues.md`.

9. Implement Programs API (contracts/programs.md; Plan § API contracts)  
   - Build `/api/search/programs` with level constraints.  
   - Add tests per contract and quickstart case 3.

10. Map + list UI [P] (Spec § Scope; Plan § Executable 10)  
    - Mapbox cluster, cards synced to bounds; facets.  
    - Output: mobile-first results view.

11. Venue page [P] (Spec § Scope; Plan § Executable 11)  
    - Hours, amenities, fees, booking/contact (validate 200 OK).  
    - Hide “open-now” if hours missing.

12. Program and Coach pages [P] (Spec § Scope; Plan § Executable 11)  
    - Level bands, price, signup URL; coach creds and inquiry CTA.

13. Error and empty states [P] (Spec § Error states; Plan § Executable 12)  
    - Implement Typesense/Supabase failures, no-results UX, offline banner.

14. Observability & reliability [P] (Plan § Audit plan; Spec § Metrics)  
    - Add Sentry, logs, uptime; index drift alerts; error budget tracking.

15. Accessibility audit [P] (Spec § Acceptance; Plan § Audit plan)  
    - Keyboard paths; Axe CI; WCAG AA automated checks pass.

16. Performance budgets [P] (Spec § Metrics and budgets)  
    - Lighthouse CI; Search API P95 ≤150 ms; LCP ≤2.0 s; INP ≤200 ms.

17. SEO checks [P] (Plan § SEO; Spec § Goals)  
    - Schema.org validation, canonicals, sitemaps, unique locality copy.

18. Release & monitor (Plan § Executable 15; Audit plan)  
    - Soft launch with LBTS photos; weekly KPI digest; capture gaps in `research.md`.

## Unknowns → research TODOs
- G‑01..G‑06 from `research.md` → assign owners and due dates before step 10.  
- Add any new vendor or TOS questions discovered in steps 5–7.

## Output format for Task agent
Each task includes: `id, title, refs, cmd (if any), deps, parallelizable`.

```json
[
  { "id": 1, "title": "Bootstrap repo and env", "refs": ["Spec § Summary", "Plan § 0"], "cmd": "npx create-next-app ...", "deps": [], "parallelizable": false },
  { "id": 4, "title": "Seed minimal data", "refs": ["Plan § 2,5"], "cmd": "node scripts/seed.js", "deps": [3], "parallelizable": true },
  { "id": 5, "title": "Provision Typesense", "refs": ["Plan § 6"], "cmd": "tsx scripts/typesense-setup.ts", "deps": [3], "parallelizable": true }
]
```

## Meta checklists
- **Ordering & references**: All core tasks map back to Spec/Plan/Contracts.  
- **Unknowns captured**: `research.md` gaps updated with owners and due dates.  
- **NFRs testable**: Budgets encoded in CI; a11y tests in CI; error/empty states covered.
