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

## One-liner (PowerShell)

Run this single command in PowerShell to stage all changes, auto-generate a Conventional Commit message with timestamp and file count, commit, and push the current branch:

```powershell
$ErrorActionPreference = 'Stop'; git add -A; $staged = git diff --cached --name-only; if ([string]::IsNullOrWhiteSpace($staged)) { Write-Output 'No changes staged. Skipping commit and push.' } else { $n = ($staged | Measure-Object -Line).Lines; $ts = Get-Date -Format "yyyy-MM-dd HH:mm zzz"; git commit -m "chore: auto-commit - $ts ($n files changed)"; git push origin HEAD }
```

## Optional: Local pre-commit tests

You can enable a local pre-commit hook to run tests before commits:

1. Ensure `.githooks/pre-commit` exists (this repo includes one).
2. Enable hooks path once per repo:

```powershell
git config core.hooksPath .githooks
```

The hook will run `npm install/ci` and then `npm run test --if-present`.

## CI: Run tests on push/PR

This repo includes a GitHub Actions workflow at `.github/workflows/ci.yml` that installs dependencies and runs `npm run test --if-present` on push and pull_request to `main`.