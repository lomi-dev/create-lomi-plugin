# Releases

Only `create-lomi-plugin` is published from this repository. The npm name remains
unchanged. CLI releases belong to `lomi-dev/plugin-tools`, SDK releases to
`lomi-dev/plugin-sdk`. A generator release does not require a CLI or SDK release.
GitHub Actions is disabled; maintainers run validation and publication manually.

1. Update the generator version. Update template SDK/CLI versions only when those
   separately published versions have been reviewed. Keep exact pins consistent
   across all four templates and their pnpm release-age exceptions. Commit the
   release changes before producing the archive so its source commit is recorded.
2. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`,
   `pnpm format:check` and `pnpm test:archive` on Linux, macOS and Windows.
   The archive suite installs the actual packed generator and published dependencies.
3. Retain the successful run's tarball from `artifacts/`, `release.json` and
   `archive-validation.json`. Verify the source commit, SHA-256 and SHA-512, and
   confirm that the validation report identifies that same archive. Preserve the
   reports from all three systems. Do not rebuild the selected archive before
   publishing or replace an existing version.
4. Publish the exact tested archive using the authorized npm owner's interactive
   2FA. Replace `<new-version>` with the new, unpublished version:

   ```sh
   npm publish "./artifacts/create-lomi-plugin-<new-version>.tgz" --access public --tag next --ignore-scripts --auth-type=web
   ```

5. Run `pnpm test:registry` manually on all three systems. Compare npm integrity
   with the tested archive. Create a GitHub prerelease at the exact source commit
   with that archive, `release.json` and the validation reports. Keep old assets.
6. Update the independently maintained CLI repository's generator-source.json with
   the version and integrity. Run its candidate CLI/archive regressions, then
   update documentation and the SDK consumer baseline after those checks pass.

The existing npm owner is `maciejkolerski`, with 2FA. Authenticate with `npm login`
when needed. This repository has no GitHub Actions publishing workflow or OIDC
publication path. Do not commit npm credentials.

Registry publication is an alpha distribution, not native desktop qualification.
Rollback by restoring a previous explicit generator version; existing generated
projects keep their own SDK/CLI pins and lockfiles. Correct changed package bytes
with a new version rather than overwriting published artifacts.
