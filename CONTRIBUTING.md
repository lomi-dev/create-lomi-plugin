# Contributing

Use Node 22.14+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`,
`pnpm check` and `pnpm format:check`. `pnpm pack:release` creates the candidate
archive. No sibling repository checkout is required.

Change SDK/CLI pins consistently across all template package.json files and their
pnpm release-age exceptions. Keep generator versioning independent of both tools.
The package files allowlist excludes development scripts, tests and credentials.
Use a new version whenever published package bytes change.

Use English conventional commits: `type(scope): imperative summary`, at most
72 characters, with an explanatory body and actual results under `Validation:`.
Preserve the user's Git identity and existing changes. Do not add AI attribution.
Commit and push only when requested. See docs/releases.md for publication.
