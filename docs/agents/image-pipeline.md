# Image Pipeline Agent SOP

## Purpose

- Generate accessible alt text and captions; detect duplicates/low quality; enforce rights/consent rules.

## Guardrails

- Respect photo rights and attribution; store consent when faces are present.
- No PII extraction; no uploading images to third parties without approval.
- TDD required: deterministic captioning tests with fixtures.

## Inputs

- Uploaded images (partner or operator provided) with optional metadata (credit, location).

## Outputs

- `{ photo_id, alt, caption, lat?, lng?, quality: 'ok'|'flag', flags?: string[] }`

## Implementation outline

- Use a local classifier for basic checks (blurry, too dark, duplicates via perceptual hash).
- Use an LLM vision model for alt text when permitted; otherwise fallback to rule-based captions.
- Enforce max caption length and neutral tone; avoid promotional adjectives.

## TDD plan

- Unit tests for pHash duplicate detection against fixture pairs.
- Unit tests for caption length/neutrality checks.
- Integration tests that simulate a batch and ensure flags/outputs match expectations.

## Observability

- Metrics: percent flagged, duplicate rate, avg caption length.
- Alerts: spikes in flags, repeated upload from same source.
