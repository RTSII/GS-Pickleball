---
summary: Moderation & Fraud SOP for user submissions and edits
---

Purpose
- Protect data quality by screening risky submissions/edits and routing sensitive changes to human review.

Guardrails
- Never auto-approve fee/hour/booking-link changes without human review.
- Log all moderation actions with actor, rationale, and diff.
- Respect privacy and do not store personal data beyond business contacts.

Inputs
- User/partner submissions or edit requests.
- Normalizer/Verifier change proposals with confidence.

Policy
- Risk scoring per field; high-risk fields (fees, hours, booking links, credentials) require manual approval.
- Auto-approve low-risk (typos, non-critical tags) if tests and validation pass.

TDD plan
- Unit tests for risk scoring and validation functions.
- Integration tests: simulate an edit queue and ensure routing/approvals behave as expected.

Observability
- Track approval rates, turnaround time, and repeated offenders.
- Alerts on spikes in high-risk changes or reversals.
