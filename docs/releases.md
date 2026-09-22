# Releases

Only `create-lomi-plugin` is published from this repository. The npm name remains
unchanged. CLI releases belong to `lomi-dev/plugin-tools`, SDK releases to
`lomi-dev/plugin-sdk`. A generator release does not require a CLI or SDK release.

1. Update the generator version. Update template SDK/CLI versions only when those
   separately published versions have been reviewed. Keep exact pins consistent
   across all four templates and their pnpm release-age exceptions.
2. Run check, test, format:check and test:archive. Require the three-platform CI
   matrix. It installs the actual packed generator and published dependencies.
3. Download the successful Linux `generator-ubuntu-latest` artifact. Verify its
   source commit, SHA-256 and SHA-512 against `release.json` and confirm the matching
   archive-validation.json. Do not rebuild or replace an existing version.
4. Publish the exact archive using the authorized npm owner's interactive 2FA:

   ```sh
   npm publish ./create-lomi-plugin-0.1.0-alpha.2.tgz --access public --tag next --ignore-scripts --auth-type=web
   ```

5. Run `pnpm test:registry` and the registry workflow on all three systems. Compare
   npm integrity with the tested archive. Create a GitHub prerelease at the exact
   source commit with that archive and the two validation reports. Keep old assets.
6. Update the independently maintained CLI repository's generator-source.json with
   the version and integrity. Run its candidate CLI/archive regressions, then
   update documentation and the SDK consumer baseline after those checks pass.

The existing npm owner is `maciejkolerski`, with 2FA. Automated publication stays
behind `NPM_PUBLISH_READY=true`, enabled only after configuring the npm trusted
publisher for owner `lomi-dev`, repository `create-lomi-plugin`, workflow
`publish.yml`, environment `npm`, with direct publishing permission. The workflow
uses Node 24/npm 11.5.1, OIDC and provenance, and publishes the exact CI artifact.
Do not reuse a trusted publisher configuration pointing to plugin-tools.

Registry publication is an alpha distribution, not native desktop qualification.
Rollback by restoring a previous explicit generator version; existing generated
projects keep their own SDK/CLI pins and lockfiles. Correct changed package bytes
with a new version rather than overwriting published artifacts.
