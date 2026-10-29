# Releases

Security distribution candidate 0.1.0-alpha.4 is prepared locally and has not been published by
this task. It requires SDK 1.1.0-alpha.2 and the Lomi runtime bridge. Publish
SDK, CLI and generator in that order, then verify registry installations.

Only `create-lomi-plugin` is published from this repository. The npm name remains
unchanged. CLI releases belong to `lomi-dev/plugin-tools`, SDK releases to
`lomi-dev/plugin-sdk`. A generator release does not require a CLI or SDK release.
GitHub Actions is disabled; maintainers run validation and publication manually.

1. Update the generator version. Update template SDK/CLI versions only when those
   separately published versions have been reviewed. Keep exact pins consistent
   across all four templates and their pnpm release-age exceptions. Commit the
   release changes before producing the archive so its source commit is recorded.
2. Run `pnpm install --frozen-lockfile`, `pnpm check` and
   `pnpm format:check`. Use `pnpm pack:release` to create a candidate archive and
   record its source commit, SHA-256 and SHA-512 in `release.json`.
3. Retain the tarball and `release.json` from `artifacts/`. Do not rebuild the
   selected archive before publishing or replace an existing version. Registry
   and native desktop qualification remain separate requirements.
4. Publish the selected archive using the authorized npm owner's interactive
   2FA. Replace `<new-version>` with the new, unpublished version:

   ```sh
   npm publish "./artifacts/create-lomi-plugin-<new-version>.tgz" --access public --tag next --ignore-scripts --auth-type=web
   ```

5. Compare npm integrity with the selected archive after publication. Create a
   GitHub prerelease at the exact source commit with the archive and `release.json`.
   Keep old assets.
6. Update the independently maintained CLI repository's generator-source.json with
   the version and integrity. Verify candidate archive integrity and source metadata against the pinned
   generator, then update documentation and the SDK consumer baseline after review.

The existing npm owner is `maciejkolerski`, with 2FA. Authenticate with `npm login`
when needed. This repository has no GitHub Actions publishing workflow or OIDC
publication path. Do not commit npm credentials.

Registry publication is an alpha distribution, not native desktop qualification.
Rollback by restoring a previous explicit generator version; existing generated
projects keep their own SDK/CLI pins and lockfiles. Correct changed package bytes
with a new version rather than overwriting published artifacts.

Generated templates retain exact registry versions. Record the exact source
archive and registry integrity for every prerelease.
