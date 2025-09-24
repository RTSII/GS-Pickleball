---
description: One-click stage, commit, and push changes with an optional commit message (auto-generated if omitted).
auto_execution_mode: 3
---

# Auto-commit

Usage:

- `/auto-commit <your message>` — uses your provided message.
- `/auto-commit` — assistant auto-generates a conventional commit message and proceeds.

By triggering `/auto-commit` without a message, you authorize the assistant to stage, commit, and push all changes while respecting `.gitignore`.

Steps:

1. Ensure your working tree is ready.

  - Run tests locally if needed: `npm test`
  - Verify `git status` is as expected (no unintended files).

// turbo
2. Stage all changes.

  - Command: git add -A
  - Respects `.gitignore`; no `-f` is used.

// turbo
3. Commit with provided or auto-generated message.

  - If no message is provided, auto-generate a Conventional Commit message, e.g.: `chore: auto-commit - <timestamp> (<n> files changed)`.
  - Command: `git commit -m "<provided-or-auto-message>"`

// turbo
4. Push to main.

  - Command: git push origin main

Notes:

- This workflow will attempt to auto-run staging/commit/push steps; depending on your Windsurf settings, you may still be asked to approve commands.
- Never use this to delete files/folders unintentionally. Review `git status` before running.
- When no message is provided, the assistant will auto-generate a message and proceed with stage/commit/push.
- `.gitignore` patterns are always respected; ignored files will not be staged.