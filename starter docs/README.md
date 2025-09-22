# GS Pickleball — Spec Kit Docs

Four Markdown files aligned to GitHub Spec Kit's slash commands:

- `constitution.md` — project principles and development guidelines.
- `specify.md` — product specification focused on the what and why.
- `plan.md` — technical implementation plan and architecture.
- `tasks.md` — actionable task list derived from the plan.

## Usage order
1) /constitution
2) /specify
3) /plan
4) /tasks

You can paste the contents of each file into your agent when using `specify init` and the slash commands, or keep them in the repo as living docs.

## Stack reference (current)

- Next.js 14, React 18
- Prisma 5, Supabase Postgres (PgBouncer pooled username `postgres.<project-ref>`)
- Typesense 0.25 (local Docker for dev; Cloud later)
- Mapbox GL JS 2.x

## How to run the workflows

- Run slash commands in the Windsurf chat input, not in PowerShell.
- Common sequence:
  - `/constitution` (amend principles and governance; versioned)
  - `/specify <feature description>` (creates a feature spec branch/file)
  - `/plan` (implementation plan from the spec)
  - `/tasks` (actionable tasks from the plan)

See root `README.md` for local setup, and `.specify/memory/constitution.md` for the authoritative constitution (now at v1.1.0).
