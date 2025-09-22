# GS Pickleball — Constitution

## Mission
Build the authoritative, local-first directory for pickleball on South Carolina’s Grand Strand. Help players find where to play **now**, discover lessons, leagues, clinics, tournaments, and shops, and enable venues and coaches to grow.

## Principles
- **Truth over hype.** Data must be accurate, sourced, and verifiable. Listings are verified and time-stamped.
- **Local-first.** Prioritize Pawleys Island → Murrells Inlet → Myrtle Beach → North Myrtle Beach.
- **Speed and clarity.** Pages render in <200 ms TTFB on cached paths; search P95 <150 ms.
- **Accessibility.** WCAG 2.2 AA. Keyboard-only nav, focus states, color contrast, alt text.
- **Privacy minimalism.** Collect only necessary data. No third-party trackers beyond analytics with IP anonymization and consent.
- **Safety.** Family-friendly content, clear venue rules, and incident reporting channel.
- **Open schema.** Stable JSON schemas with versioning for venues, programs, coaches, shops, and events.
- **Observe and learn.** Ship with logs, metrics, traces; weekly KPI review drives change.

## Decision rights
- **Product scope:** Product lead decides after reviewing metrics and partner feedback.
- **Data quality:** Data steward owns verification SLAs and rollback decisions.
- **Engineering:** Tech lead owns architecture and performance budgets.
- **Compliance:** Legal/operations approve terms, privacy, and photo rights.

## Non‑negotiables
- Verified contact + booking links before “Book” buttons go live.
- Clear disclosure for sponsored/featured listings.
- Secure by default. Search-only keys in browser; admin keys server-only.

## Development guidelines
- **Source of truth:** Supabase Postgres + PostGIS. Search is a read model in Typesense.
- **Migrations:** Prisma migrations reviewed and applied in staging before prod.
- **Indexing:** CDC/cron upserts to Typesense. Nightly reconciliation counts.
- **Testing:** Unit on all utilities; e2e for search flows and checkout; contract tests on API.
- **Performance budgets:** LCP <2.0s on 4G; JS <200KB on results pages.
- **SEO:** Programmatic city/intent pages with correct schema.org. Avoid thin content.
- **Images:** Only rights-cleared photos. Store consent and credits. Generate alt text on ingest.
- **Change management:** RFCs for schema or API breaking changes with version gates.

## Roles
- Product lead, Tech lead, Data steward, Community/Partnerships, Support.

## Review cadence
- Weekly: KPIs, incident review, backlog grooming.
- Monthly: SEO and supply coverage audits; partner satisfaction survey.

## Acceptance gates
- MVP complete when: 75+ venues, 10+ coaches, map + facet search, “Open now” filter, partner intake live, core SEO pages indexed.
- Monetization ready when: Stripe subscriptions live, first 5 partners onboarded, program booking flow tested end‑to‑end.

## Appendices
- **Licensing & Rights:** Written permission from LBTS and other venues for logos, facility names when required, and on-premise photos.
- **Data SLA:** Venues recrawled weekly, programs daily, events closed at end date.

---

## Governance & Version

- This starter document is a convenience copy. The canonical constitution lives at
  `.specify/memory/constitution.md` and is versioned via the `/constitution` workflow.
- Current version: **v1.1.0** (Ratified: 2025-09-22, Last Amended: 2025-09-22).
- To propose changes, run `/constitution` in the Windsurf chat with the updated fields.
