---
description: Clarify underspecified areas of the feature specification before planning.
auto_execution_mode: 3
---

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

The text the user typed after `/clarify` in the triggering message **is** the feature description or clarification request. Assume you always have it available in this conversation even if `$ARGUMENTS` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that feature description or clarification request, do this:

1. **Load Current Specification**: Read the current feature specification from the appropriate spec file to understand the current state and identify areas needing clarification.

2. **Structured Clarification Process**: Use systematic questioning to clarify underspecified areas, focusing on:
   - **Functional Requirements**: What the feature should do in specific scenarios
   - **User Experience**: How users will interact with the feature
   - **Technical Constraints**: Performance, security, compatibility requirements
   - **Edge Cases**: Error conditions, boundary conditions, and unusual scenarios
   - **Integration Points**: How this feature connects with existing systems
   - **Success Criteria**: How to measure if the feature is working correctly

3. **Update Specification**: Enhance the specification with clarified requirements, adding or updating sections as needed:
   - Add a "Clarifications" section if it doesn't exist
   - Update acceptance criteria with clarified requirements
   - Add missing user stories or use cases
   - Refine technical constraints and non-functional requirements

4. **Report Completion**: Provide a summary of what was clarified and updated, with the path to the updated spec file and readiness for the `/plan` phase.

Note: This should be run before `/plan` to reduce rework downstream. If the user explicitly wants to skip clarification, they should state that clearly.

**Clarification Framework**:
- Ask about specific user workflows and pain points
- Clarify technical implementation preferences (e.g., "real-time updates or polling?")
- Identify any regulatory or compliance requirements
- Determine performance expectations (e.g., "sub-second response time?")
- Clarify error handling and recovery scenarios
