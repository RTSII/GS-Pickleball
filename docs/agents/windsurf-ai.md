---
summary: Windsurf AI Agent SOP for Spec-Driven Development workflow
---

# Windsurf AI Agent SOP

Purpose

- Execute the structured Spec-Driven Development workflow using Windsurf IDE
- Generate specifications, plans, tasks, and implement features following TDD principles
- Maintain consistency with project constitution and architectural patterns

Guardrails

- Follow TDD pathway: tests first, red-green-refactor cycle
- Align with Security & Secrets Hygiene, Data Model Is Source of Truth principles
- Maintain accessibility standards and performance requirements
- Use structured workflows: /specify → /clarify → /plan → /tasks → /implement
- Respect .gitignore and never commit secrets or credentials

Inputs

- Feature descriptions from user via slash commands
- Project constitution and existing codebase context
- Template files and workflow definitions

Outputs

- Feature specifications with acceptance criteria
- Technical implementation plans
- Executable task lists
- Implemented code with comprehensive tests
- Updated documentation and README files

Workflow Commands

- `/constitution` - Update project principles and guidelines
- `/specify` - Create feature specifications from natural language
- `/clarify` - Refine requirements with structured questioning
- `/plan` - Generate technical implementation plans
- `/tasks` - Create actionable development tasks
- `/implement` - Execute implementation with TDD approach
- `/auto-commit` - Stage, commit, and push changes (respects `.gitignore`)

Constitution Reference

- See `.specify/memory/constitution.md` (v1.3.0). All workflows and outputs must conform to security, TDD, accessibility, and performance principles.

Platform

- Primary environment: Windows with PowerShell. Provide commands in PowerShell format by default.
- Respect `.gitignore` at all times; never commit secrets or credentials.

TDD Requirements

- All new logic must have unit and integration tests
- Test coverage thresholds: Lines ≥70%, Branches ≥60%, Functions ≥70%
- Tests run in CI pipeline before any deployment
- Mock external dependencies appropriately

Error Handling

- Provide clear, actionable error messages
- Log correlation IDs for debugging
- Graceful degradation for optional features
- Retry mechanisms for transient failures

Performance Standards

- Search API P95 ≤150ms, P99 ≤300ms
- First contentful paint ≤2.0s on 4G
- Maintain mobile-first responsive design
- Optimize for Core Web Vitals metrics

Security Practices

- No secrets in code or commit messages
- Validate all user inputs and API responses
- Follow OWASP security guidelines
- Regular dependency updates and security scans

Observability

- Comprehensive logging with structured format
- Performance monitoring and alerting
- Error tracking and correlation
- Usage analytics for feature adoption
