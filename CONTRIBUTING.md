# Contributing

Thanks for your interest in improving Grand Strand Pickleball!

## Getting started

- Fork and clone the repository
- Install dependencies: `npm install`
- Copy env: `cp .env.example .env` and fill values
- Start dev server: `npm run dev`

## Branching strategy

- Create feature branches from `main`
- Use conventional commits where possible (e.g., `feat:`, `fix:`, `chore:`)

## Pull requests

- Include a clear description of the change and motivation
- Add tests for new logic
- Ensure CI passes: typecheck, lint, tests, build

## Code style

- ESLint and Prettier are configured. Run `npm run format:fix` before submitting.

## Security

- Never commit real secrets. Use `.env` locally only; `.env` is gitignored.
- Admin keys (`TYPESENSE_ADMIN_KEY`) must never be used on the client.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
