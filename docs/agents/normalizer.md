---
summary: Normalizer/Deduper SOP for schema coercion and confidence scoring
---

# Normalizer Agent SOP

## Purpose

- Transform raw scraped JSON into schema-aligned records; dedupe near-duplicates; emit merge patches with confidence.

## Guardrails

- Treat Prisma schema as contract. Reject if required fields missing.
- Never write directly to production tables without passing tests and human review for high-risk fields.
- TDD required: contract tests for input→output mapping.

## Inputs

- Raw records from crawler with `sourceUrl` and unstructured fields.
- Geocoding service (if needed) via server-side key.

## Outputs

- Merge patches: `{ op: 'upsert', entity: 'Venue'|'Program'|..., id?, before?, after, confidence }`.
- Confidence: numeric 0..1 with per-field attribution where possible.

## Coercion rules (examples)

- `hours`: normalize to `{ tz, mon..sun: [["HH:MM","HH:MM"]] }`; support overnight windows.
- `fee_range`: parse to `feeMin`/`feeMax` in cents.
- `level`: map 3.0–3.5 → `{ skillMin: 3.0, skillMax: 3.5 }`.
- URLs: validate HTTP 200 or `mailto:`/`tel:` before emitting.

## Deduping

- Candidate keys: normalized name + city + distance threshold.
- Fallback: phone/email/site matches.

## TDD plan

- Unit tests: coercers (fees, levels, hours) with fixtures in `tests/fixtures/`.
- Contract tests: JSON-in → patch-out validation under `tests/integration/normalizer/`.
- Edge cases: missing fields, conflicting values, bad URLs.

## Example contract test

```ts
import { describe, it, expect } from "vitest";
import { normalizeVenue } from "../../../scripts/normalizer/venue";
import raw from "../../fixtures/normalizer/venue-raw.json";

describe("normalizeVenue", () => {
  it("produces a merge patch with confidence", () => {
    const patch = normalizeVenue(raw as any);
    expect(patch.op).toBe("upsert");
    expect(patch.entity).toBe("Venue");
    expect(patch.after.name).toBeDefined();
    expect(patch.confidence).toBeGreaterThanOrEqual(0.8);
  });
});
```

## Observability

- Log normalization errors with sourceUrl and field blame.
- Track dedupe rate and average confidence.
