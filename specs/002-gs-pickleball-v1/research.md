# Research: GS Pickleball v1 Core

**Date**: 2025-09-24  
**Source Spec**: specs/002-gs-pickleball-v1/spec.md

## Unknowns to Resolve
- Geo → Timezone mapping choice; DST behavior for “open now”.
- Default geo radius (25 miles) and tie-breaker strategy (distance + relevance).
- Synonyms list and typo tolerance thresholds in search.
- Email alert cadence, quiet hours, and unsubscribe granularity.
- Program required fields and validation nuances.

## Findings and Decisions
- Decision: Use geo-derived timezone; rely on library for DST application.  
  Rationale: Reliability and correctness; minimal manual rule handling.  
  Alternatives: Custom rules — rejected due to complexity and risk.  
- Decision: Default radius 25 miles (40 km); sort by distance, tie-break by relevance.  
  Rationale: Matches local discovery patterns; balanced recall and precision.  
- Decision: Synonyms include pickleball/pickle ball, clinic/lesson, league/ladder; enable typo tolerance.  
  Rationale: Common user inputs; improves recall.  
- Decision: Email digests daily/weekly; quiet hours 21:00–07:00 local; per-category opt-out.  
  Rationale: User respect and control; avoids notification fatigue.  
- Decision: Program fields required as per spec; status supports scheduled/cancelled/moved.  
  Rationale: Completeness for planning and user confidence.

## Next Steps
- Reflect decisions in contracts and data model.  
- Validate choices against acceptance criteria and performance budgets.  
- Prepare quickstart validation scenarios.
