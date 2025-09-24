---
summary: AI Agents SOP for collaborative development workflow
---

# AI Development Agents SOP

Purpose

- Establish clear guidelines for AI-assisted development practices
- Ensure consistent quality and adherence to project standards
- Maximize productivity while maintaining code quality and security

Core Principles

- **TDD First**: Always write tests before implementation
- **Security by Design**: Consider security implications in every decision
- **Performance Aware**: Optimize for user experience and system efficiency
- **Accessibility First**: Build inclusive features from the start
- **Documentation Driven**: Maintain clear, up-to-date documentation

Agent Selection Guidelines

- **Windsurf**: Primary agent for structured Spec-Driven Development workflow
- **GitHub Copilot**: IDE-based code completion and suggestions
- **Claude Code**: Complex reasoning and architectural decisions
- **Other Agents**: Use case-specific tools for specialized tasks

Workflow Integration

1. **Feature Planning**: Use /specify to create detailed specifications
2. **Requirements Clarification**: Use /clarify for thorough requirements analysis
3. **Technical Planning**: Use /plan to generate implementation strategies
4. **Task Breakdown**: Use /tasks to create actionable development items
5. **Implementation**: Use /implement with TDD approach
6. **Review and Refinement**: Iterate based on test results and feedback

Code Quality Standards

- **Test Coverage**: Maintain minimum thresholds across all metrics
- **Code Style**: Follow project linting and formatting rules
- **Documentation**: Include comprehensive comments and README updates
- **Error Handling**: Implement robust error handling and logging
- **Performance**: Optimize algorithms and database queries

Security Requirements

- **Input Validation**: Validate all user inputs and API responses
- **Authentication**: Implement proper authentication flows
- **Authorization**: Enforce appropriate access controls
- **Data Protection**: Handle sensitive data according to privacy policies
- **Dependency Security**: Keep dependencies updated and scanned

Communication Protocols

- **Clear Requests**: Provide specific, actionable instructions to agents
- **Context Provision**: Include relevant background and constraints
- **Feedback Loops**: Review and provide feedback on agent outputs
- **Documentation**: Record decisions and rationale for future reference

Monitoring and Observability

- **Performance Metrics**: Track response times and resource usage
- **Error Tracking**: Monitor error rates and patterns
- **User Analytics**: Measure feature adoption and usage patterns
- **System Health**: Implement health checks and alerting

Continuous Improvement

- **Retrospectives**: Regular review of agent-assisted development processes
- **Tool Evaluation**: Assess new tools and techniques for potential adoption
- **Skill Development**: Continuous learning and adaptation to new capabilities
- **Process Optimization**: Refine workflows based on lessons learned

Troubleshooting Guidelines

- **Agent Confusion**: Provide clearer context and break down complex requests
- **Quality Issues**: Request specific improvements and provide examples
- **Performance Problems**: Identify bottlenecks and request optimizations
- **Integration Issues**: Verify compatibility and request necessary adjustments

Constitution Reference

- See `.specify/memory/constitution.md` (v1.3.0). All decisions and outputs must conform to security, TDD, accessibility, and performance principles.

Platform

- Primary environment: Windows with PowerShell. Provide commands in PowerShell format by default.
- Respect `.gitignore` at all times; never commit secrets or credentials.
