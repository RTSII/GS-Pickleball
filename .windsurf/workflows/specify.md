---
description: Create or update the feature specification from a natural language feature description.
auto_execution_mode: 3
---

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

The text the user typed after `/specify` in the triggering message **is** the feature description. Assume you always have it available in this conversation even if `$ARGUMENTS` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that feature description, do this:

1. **Parse and Validate Input**: Extract the feature description from $ARGUMENTS and validate it's not empty. If empty, prompt user for clarification.

2. **Check Project Context**: Verify you're in a valid project directory with:
   - Git repository initialized
   - `.specify/` directory present
   - Template files available

3. **Execute Specification Script**: Run the script `.specify/scripts/powershell/create-new-feature.ps1 -Json "$ARGUMENTS"` from repo root and parse its JSON output for BRANCH_NAME and SPEC_FILE. All file paths must be absolute.
   **IMPORTANT** You must only ever run this script once. The JSON is provided in the terminal as output - always refer to it to get the actual content you're looking for.

4. **Load Template Structure**: Load `.specify/templates/spec-template.md` to understand required sections and ensure comprehensive coverage.

5. **Generate Specification**: Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the feature description while preserving section order and headings. Include:
   - **Feature Summary**: Clear problem statement and solution overview
   - **User Stories**: Specific scenarios and acceptance criteria
   - **Technical Requirements**: Implementation details and constraints
   - **Success Metrics**: How to measure feature completion
   - **Edge Cases**: Error conditions and boundary scenarios

6. **Validate and Enhance**: Ensure the specification aligns with project constitution and includes:
   - Security considerations
   - Performance requirements
   - Accessibility standards
   - Testing strategy

7. **Report Completion**: Provide summary with branch name, spec file path, and readiness for the next phase (`/clarify` then `/plan`).

Note: The script creates and checks out the new branch and initializes the spec file before writing. Always verify the specification quality before proceeding to clarification and planning phases.

**Best Practices**:
- Use clear, measurable acceptance criteria
- Include both happy path and error scenarios
- Consider mobile-first design principles
- Align with existing codebase patterns and architecture