---
summary: Web crawler/extractor SOP for venues/programs/coaches
---

# Crawler Agent SOP

## Purpose

- Crawl public sources, extract structured data, and emit normalized JSON suitable for ingestion.

## Guardrails

- Respect robots.txt and rate limits; backoff with jitter.
- Do not scrape pages behind logins or paywalls.
- No secrets in prompts or logs. Use server-side keys only.
- TDD required: ship unit/integration tests with fixtures.

## Stack

- Playwright (Chromium) for navigation and extraction.
- TypeScript for crawler code; Vitest for tests.
- Optional prompting for parsing edge cases (LLM-assisted HTML-to-JSON) must be deterministic and testable.

## Inputs

- Seed URLs and CSS/XPath selectors (repo: `scripts/crawlers/` or `docs/sources.md`).
- Config: `maxPages`, `concurrency`, `delayMs`, `userAgent`, `timeoutMs`.

## Outputs

- Normalized JSON records (venues/programs/coaches) matching Prisma schema fields.
- Change set file or stream for downstream normalizer.

## Data contract (excerpt)

- Venue: { id?, name, address, city, state, lat, lng, indoor, lights, feeMin?, feeMax?, bookUrl?, hoursJson?, phone?, email?, site?, sourceUrl?, tags[] }
- Program: { id?, venueId, kind, skillMin?, skillMax?, startTs?, endTs?, price?, signupUrl? }
- Coach: { id?, name, creds?, rateHour?, ratingAvg?, cities[], contact?, site? }

## Implementation checklist

- [ ] Create `scripts/crawlers/<source>.ts` with Playwright navigation and extraction.
- [ ] Map unstructured fields into normalized JSON.
- [ ] Log with correlation IDs; summarize counts and errors.
- [ ] Write per-run logs to `logs/crawler-<source>-<ts>.log`.
- [ ] Emit records to a file or message queue for the normalizer.

## TDD plan

- Unit tests: field mappers and HTML parsers (`tests/unit/crawlers/<source>.test.ts`).
- Integration tests: run against saved HTML fixtures in `tests/fixtures/html/<source>/`.
- Error cases: timeouts, missing fields, unexpected layouts.

## Example test outline

```ts
import { describe, it, expect } from "vitest";
import { parseVenue } from "../../../scripts/crawlers/visit-mb/parse";
import html from "../../fixtures/html/visit-mb/venue1.html?raw";

describe("parseVenue", () => {
  it("maps fields to normalized schema", () => {
    const v = parseVenue(html);
    expect(v.name).toBeDefined();
    expect(v.city).toMatch(/(Pawleys|Myrtle|NMB)/);
  });
});
```

## Runbook

- `npm run test` / `npm run test:watch`
- `PLAYWRIGHT_BROWSERS_PATH=0 node scripts/crawlers/<source>.ts`

## Observability

- Metrics: pages crawled, success rate, avg response, error codes.
- Alerts: sustained 4xx/5xx, parse failures >5%.
