# Security Policy

## Supported Versions

We maintain the `main` branch. Security fixes will be applied promptly.

## Reporting a Vulnerability

If you discover a security issue:

- Do not file a public issue.
- Email the maintainer privately with details and steps to reproduce.
- We will acknowledge receipt within 72 hours and provide an ETA for a fix.

## Key handling

- Never expose `TYPESENSE_ADMIN_KEY` to the browser.
- Use `TYPESENSE_SEARCH_KEY` on the server; use `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY` only for client-side queries.
- Keep `.env` files out of version control.
