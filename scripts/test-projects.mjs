import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  realpath,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { pack, run, root } from "./pack.mjs";

const registry = process.argv.includes("--registry");
const metadata = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const packed = registry ? undefined : await pack();
const directory = await realpath(
  await mkdtemp(join(tmpdir(), "lomi-generator-install-")),
);
process.env.npm_config_store_dir = join(directory, "store");
process.env.npm_config_cache = join(directory, "cache");
process.env.npm_config_registry = "https://registry.npmjs.org";
const spec = registry ? metadata.version : `file:${packed.archive}`;
const runner = join(directory, "runner");
await mkdir(runner);
await writeFile(
  join(runner, "package.json"),
  JSON.stringify(
    {
      private: true,
      packageManager: "pnpm@11.25.0",
      dependencies: { "create-lomi-plugin": spec },
    },
    null,
    2,
  ),
);
run("pnpm", ["install", "--ignore-scripts"], runner);
run("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], runner);
const installed = join(runner, "node_modules/create-lomi-plugin");
const installedMetadata = JSON.parse(
  await readFile(join(installed, "package.json"), "utf8"),
);
assert.equal(installedMetadata.version, metadata.version);
assert.equal(installedMetadata.repository.url, metadata.repository.url);
for (const file of await readdir(installed))
  assert.ok(
    [
      "index.mjs",
      "templates",
      "README.md",
      "LICENSE",
      "package.json",
      "node_modules",
    ].includes(file),
    file,
  );
const registryPackages = [];
const results = [];
for (const template of ["panel", "sidebar", "command", "theme"]) {
  const project = join(directory, `autor żółć ${template}`);
  const args = [
    "exec",
    "create-lomi-plugin",
    project,
    "--id",
    `example.${template}`,
    "--name",
    `Żółć ${template} "test"`,
    "--template",
    template,
    "--json",
  ];
  console.log(`Testing installed generator: ${template}`);
  const generated = JSON.parse(run("pnpm", args, runner));
  assert.equal(generated.ok, true);
  assert.equal(generated.schemaVersion, 1);
  assert.equal(
    await readFile(join(project, ".gitignore"), "utf8"),
    await readFile(join(root, "templates", template, "gitignore"), "utf8"),
  );
  assert.throws(() => run("pnpm", args, runner), /GENERATOR_FAILURE/);
  const pkg = JSON.parse(await readFile(join(project, "package.json"), "utf8"));
  const expected = JSON.parse(
    await readFile(join(root, "templates", template, "package.json"), "utf8"),
  );
  assert.deepEqual(pkg.devDependencies, expected.devDependencies);
  for (const spec of Object.values({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }))
    assert.doesNotMatch(spec, /^(file:|link:|workspace:)/);
  run("pnpm", ["install", "--ignore-scripts"], project);
  run("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], project);
  for (const command of ["check", "test", "build", "doctor", "package"])
    await writeFile(
      join(directory, `${template}-${command}.log`),
      run("pnpm", ["run", command], project),
    );
  results.push({
    template,
    sdk: pkg.devDependencies["@lomi-dev/plugin-sdk"],
    cli: pkg.devDependencies["@lomi-dev/plugin-cli"],
    lockSHA256: createHash("sha256")
      .update(await readFile(join(project, "pnpm-lock.yaml")))
      .digest("hex"),
    checks: [
      "installed-generator",
      "no-overwrite",
      "registry-dependencies",
      "frozen-install",
      "check",
      "test",
      "build",
      "doctor",
      "package",
    ],
  });
}
for (const [name, version] of [
  ...(registry ? [[metadata.name, metadata.version]] : []),
  ["@lomi-dev/plugin-sdk", results[0].sdk],
  ["@lomi-dev/plugin-cli", results[0].cli],
]) {
  const dist = JSON.parse(
    run("pnpm", ["view", `${name}@${version}`, "dist", "--json"], root),
  );
  assert.match(dist.integrity, /^sha512-/);
  assert.ok(dist.tarball.startsWith("https://registry.npmjs.org/"));
  registryPackages.push({ name, version, ...dist });
}
const report = {
  schemaVersion: 1,
  date: new Date().toISOString(),
  sourceCommit: run("git", ["rev-parse", "HEAD"], root).trim(),
  distribution: registry ? "npm" : "generator-archive-with-npm-dependencies",
  generatorSpec: spec,
  archive: packed?.report,
  registryPackages,
  directory,
  platform: `${process.platform}-${process.arch}`,
  results,
  desktopTested: false,
};
await mkdir(join(root, "artifacts"), { recursive: true });
await writeFile(
  join(
    root,
    "artifacts",
    registry ? "registry-validation.json" : "archive-validation.json",
  ),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
