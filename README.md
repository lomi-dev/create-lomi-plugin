# Create Lomi plugin

The standalone generator for Lomi plugin projects. It owns the panel, sidebar,
command and theme templates. [plugin-tools](https://github.com/lomi-dev/plugin-tools)
owns the CLI; [plugin-sdk](https://github.com/lomi-dev/plugin-sdk) owns the contract.
Each repository has its own version and release procedure.

Use Node 22.14+ and pnpm 11.25.0:

```sh
pnpm create lomi-plugin@0.1.0-alpha.2 my-plugin --id example.my-plugin --name "My plugin" --template panel
cd my-plugin
pnpm install --ignore-scripts
pnpm check
pnpm test
pnpm build
pnpm run doctor
pnpm package
```

Templates pin `@lomi-dev/plugin-cli@0.1.0-alpha.1` and
`@lomi-dev/plugin-sdk@1.1.0-alpha.0` from npm. Commit the generated lockfile.
No application sources, SDK checkout or Rust compiler are needed.

In an interactive terminal, the generator asks for missing answers. Without a
terminal, `--id` and `--name` are required. The default template is panel.
`--json` emits schemaVersion 1 without prompts; `--help` lists arguments.
The destination must be new or empty. Generation installs no dependencies and
creates no Git repository. Errors and interruption preserve existing user files.

Import `package/` in Settings > Plugins, enable the plugin and approve its revision.
This remains alpha with manual import; there is no `dev` command. Native desktop
qualification is still pending. See the [author guide](https://github.com/lomi-dev/docs-app/blob/main/src/content/docs/plugins/quick-start.md).

## Development

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm format:check
pnpm test:archive
```

GitHub Actions is disabled in this repository. Run these checks manually on
Linux, macOS and Windows before releasing. The archive test exercises all four
templates outside the repository with actual npm dependencies. Publish the exact
tested tarball using the manual [release procedure](docs/releases.md).

## History

Generator history was extracted from `lomi-dev/plugin-tools` at
`83bde54105e15f64a463f1f63ec7d60065e9abcc` using `git subtree split`.
Versions through 0.1.0-alpha.1 retain their original npm metadata and GitHub assets.
Version 0.1.0-alpha.2 is the first release sourced from this repository.

Apache-2.0.
