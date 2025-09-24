 # Feature Specification: GS Pickleball v1 Core
 
 **Feature Branch**: `002-gs-pickleball-v1`  
 **Created**: 2025-09-24  
 **Status**: Draft  
 **Input**: User description: "GS Pickleball v1 core feature (based on docs/specify.md scope)"
 
 ## Execution Flow (main)
 ```text
 1. Parse user description from Input
    → If empty: ERROR "No feature description provided"
 2. Extract key concepts from description
    → Identify: actors, actions, data, constraints
 3. For each unclear aspect:
    → Mark with [NEEDS CLARIFICATION: specific question]
 4. Fill User Scenarios & Testing section
    → If no clear user flow: ERROR "Cannot determine user scenarios"
 5. Generate Functional Requirements
    → Each requirement must be testable
    → Mark ambiguous requirements
 6. Identify Key Entities (if data involved)
 7. Run Review Checklist
    → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
    → If implementation details found: ERROR "Remove tech details"
 8. Return: SUCCESS (spec ready for planning)
 ```
 
 ---
 
 ## ⚡ Quick Guidelines
 - ✅ Focus on WHAT users need and WHY
 - ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
 - 👥 Written for business stakeholders, not developers
 
 ### Section Requirements
 - **Mandatory sections**: Must be completed for every feature
 - **Optional sections**: Include only when relevant to the feature
 - When a section doesn't apply, remove it entirely (don't leave as "N/A")
 
 ### For AI Generation
 When creating this spec from a user prompt:
 1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
 2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
 3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
 4. **Common underspecified areas**:
    - User types and permissions
    - Data retention/deletion policies  
    - Performance targets and scale
    - Error handling behaviors
    - Integration requirements
    - Security/compliance needs
 
 ---
 
 ## User Scenarios & Testing (mandatory)
 
 ### Primary User Story
 A player in the Grand Strand wants to quickly find where to play now, see available programs and coaches, and get to a booking or contact action.
 
 ### Acceptance Scenarios
 1. Given a user in Pawleys Island, when they search with "indoor = true" and "open now = true", then results are sorted by distance and exclude outdoor-only venues.
 2. Given a venue detail view, when a booking/contact option exists, then at least one valid link or contact method is shown (200 OK or mailto/tel).
 3. Given program filters by date, level, and price, when filters are applied, then only matching programs are shown with clear level bands.
 4. Given a favorites action, when a signed-in user taps "favorite", then the venue/program/coach is saved to their account; if signed-out, it is saved locally on the device.
 5. Given calendar export, when a user exports a program/event, then the iCal file imports without errors in Apple Calendar and Google Calendar.
 
 ### Edge Cases
 - Overnight hours: Venues with hours spanning midnight correctly reflect "open now" across splits.
 - Missing hours: If hours are unknown, "open now" is hidden and an informational message is shown.
 - Geo denied: If location permission is denied, the user can enter a manual location and default to Myrtle Beach centerpoint.
 - No results: An empty state explains how to broaden search and suggests nearby public courts.
 
 ## Requirements (mandatory)
 
 ### Functional Requirements
 - **FR-001**: Provide map + list search with clustering and filters: indoor, lights, open-now, fee range, lessons available.
 - **FR-002**: Show venue pages with amenities, fees, parking notes, booking links, hours, and contact information.
 - **FR-003**: Provide program discovery with filtering by kind (lesson/clinic/league/ladder/tournament), level band, date, and price.
 - **FR-004**: Provide a coach directory with profiles (credentials, cities served, rates) and an inquiry CTA.
 - **FR-005**: Provide an event calendar with iCal export and import validation success criteria.
 - **FR-006**: Support favorites for venues/programs/coaches (account-based; fallback to local storage for guests).
 - **FR-007**: Support alerts via email digests (daily/weekly), respecting quiet hours (21:00–07:00 local) and per-category opt-out.
 - **FR-008**: Implement "open now" logic that is timezone-aware (derived from geo), DST-safe, and handles overnight intervals.
 - **FR-009**: Implement search relevance and typo tolerance with synonyms (pickleball/pickle ball, clinic/lesson, league/ladder); results sort by distance with relevance tie-breakers.
 - **FR-010**: Ensure accessibility: keyboard navigability, alt text, and conformance to WCAG AA automated checks.
 
 ### Key Entities (include if data involved)
 - **Venue**: Name, address, geolocation, amenities (indoor, lights), fees, hours (multiple intervals; overnight splits), booking/contact, tags.
 - **Program**: Kind (lesson/clinic/league/ladder/tournament), level_min/max, start/end, price, signup URL, capacity, remaining (optional), location reference.
 - **Coach**: Name, credentials, cities served, rate, rating, verified flag with evidence reference.
 - **Shop**: Services (retail/stringing/repairs/demo), contact, geolocation, notes.
 - **Event**: Title, start/end, description, URL; exportable as iCal.
 
 ---
 
 ## Review & Acceptance Checklist
 *GATE: Automated checks run during main() execution*
 
 ### Content Quality
 - [ ] No implementation details (languages, frameworks, APIs)
 - [ ] Focused on user value and business needs
 - [ ] Written for non-technical stakeholders
 - [ ] All mandatory sections completed
 
 ### Requirement Completeness
 - [ ] No [NEEDS CLARIFICATION] markers remain
 - [ ] Requirements are testable and unambiguous  
 - [ ] Success criteria are measurable
 - [ ] Scope is clearly bounded
 - [ ] Dependencies and assumptions identified
 
 ---
 
 ## Execution Status
 *Updated by main() during processing*
 
- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked (none remaining due to Clarifications)
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed
 
---
 
## Notes
- This spec reflects the canonical product scope described in `docs/specify.md` and the Clarifications section applied on 2025-09-24.
 
## Clarifications Applied
- Favorites: Account-based; guests fall back to local storage.
- Alerts: Email digests (daily/weekly), quiet hours 21:00–07:00 local, per-category opt-out.
- Open-now logic: Venue-local time, timezone via geo lookup, DST-aware; supports overnight intervals.
- Search semantics: 25-mile default; sort by distance with relevance tie-breakers; weights `name^3, city^2, tags^2, amenities^1`; synonyms pickleball/pickle ball, clinic/lesson, league/ladder.
- Programs: Required fields include title, kind, level_min/max, start/end (ISO), price, location_id, signup_url, capacity; `remaining` optional.
- Security/Privacy: Mask PII in logs; 30-day retention for inquiries; public search 60 req/min/IP, server-side 600 req/min.

It is ready to proceed to `/plan`.
