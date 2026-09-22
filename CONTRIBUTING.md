# Contributing

Use Node 22.14+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`,
`pnpm check`, `pnpm test`, `pnpm format:check` and `pnpm test:archive`.
The archive suite installs the generator in a fresh temporary directory, then
installs exact CLI/SDK versions from npm for all four templates. No sibling
repository checkout is required. `pnpm test:registry` checks a published version.

Change SDK/CLI pins consistently across all template package.json files and their
pnpm release-age exceptions. Keep generator versioning independent of both tools.
The package files allowlist excludes development scripts, tests and credentials.
Use a new version whenever published package bytes change.

Use English conventional commits: `type(scope): imperative summary`, at most
72 characters, with an explanatory body and actual results under `Validation:`.
Preserve the user's Git identity and existing changes. Do not add AI attribution.
Commit and push only when requested. See docs/releases.md for publication.
