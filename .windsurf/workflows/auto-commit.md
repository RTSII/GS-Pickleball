---
description: One-click stage, commit, and push changes with a provided commit message.
---

Provide your commit message after the command when triggering: `/auto-commit <your message>`

Steps:

1. Ensure your working tree is ready.
   - Run tests locally if needed: `npm test`
   - Verify `git status` is as expected (no unintended files).

// turbo
2. Stage all changes.
   - Command: git add -A

// turbo
3. Commit with your message.
   - Command: git commit -m "$ARGUMENTS"

// turbo
4. Push to main.
   - Command: git push origin main

Notes:
- This workflow will attempt to auto-run staging/commit/push steps; depending on your Windsurf settings, you may still be asked to approve commands.
- Never use this to delete files/folders unintentionally. Review `git status` before running.
