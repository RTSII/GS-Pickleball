---
summary: Analytics Agent SOP for KPIs and anomaly detection
---

# Analytics Agent SOP

## Purpose

- Produce a weekly KPI digest and flag anomalies without mutating data.

## Guardrails

- Read-only access; never writes to production.
- No PII in summaries; aggregate metrics only.
- TDD required: metric calculators and anomaly detectors are unit-tested.

## Inputs

- Event logs, search metrics, index drift reports, error rates.

## Outputs

- Markdown digest with KPIs and notable changes.
- Anomaly report with suggested follow-ups.
- Write weekly digest file to `docs/ops/analytics/digests/weekly-YYYY-MM-DD.md`.

## KPIs (examples)

- Supply: listings coverage %, verified rate, time-to-verify.
- Demand: search CTR, venue page dwell, call/contact clicks.
- Monetization: paid listings %, lead→booking %, ARPU.
- Quality: index drift, dead-link rate, normalization error rate.

## TDD plan

- Unit tests for KPI calculations given small fixtures.
- Unit tests for anomaly thresholds and trend detection.

## Observability

- Keep a log of digests; alert on missing weekly run or sudden KPI swings.
