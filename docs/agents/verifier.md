---
summary: Verifier SOP for field verification via call/email loops
---

# Verifier Agent SOP

## Purpose

- Verify critical fields (fees, hours, booking/contact links) with human-in-the-loop where needed.

## Guardrails

- No PII beyond business contacts; store consent and call notes securely.
- High-risk changes require human approval with a diff.
- TDD required: parsers for replies and templates have unit tests.

## Inputs

- Candidate changes from normalizer with `sourceUrl` and confidence.
- Contact methods (phone/email) from listings.

## Outputs

- Structured call/email notes.
- Approved change sets: `{ entity, id, changes: { field: { before, after } }, approvedBy, timestamp }`.

## Process

1) Prepare scripts from templates with variables (venue name, fields, sourceUrl).
2) Place call or send email; collect structured responses.
3) Parse replies into a change set; require human approval for high-risk fields.
4) Commit approved changes to DB via a controlled endpoint with audit logging.

## TDD plan

- Unit tests for email/template variable substitution and parser.
- Integration tests that simulate change-set approval flow.

## Example email template (YAML excerpt)

```yaml
subject: "Quick verification of hours and booking link for {{name}}"
body: |
  Hi {{contact_name}},
  We list {{name}} for local pickleball players. Could you verify the following?
  - Hours (local time): {{hours}}
  - Booking link: {{book_url}}
  Reply with any corrections. Thank you!
```

## Observability

- Track verification attempts, response rate, approval/decline counts.
- Alert on repeated discrepancies for the same venue.

## Platform

- Primary environment: Windows with PowerShell. Provide commands in PowerShell format by default.
- Respect `.gitignore` at all times; never commit secrets or credentials.
