import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { root, run } from "./pack.mjs";

for (const folder of ["scripts", "tests"])
  for (const file of await readdir(join(root, folder)))
    if (file.endsWith(".mjs"))
      run(process.execPath, ["--check", join(root, folder, file)], root);
run(process.execPath, ["--check", join(root, "index.mjs")], root);
const metadata = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
assert.equal(metadata.name, "create-lomi-plugin");
assert.equal(
  metadata.repository.url,
  "git+https://github.com/lomi-dev/create-lomi-plugin.git",
);
assert.deepEqual(metadata.files, [
  "index.mjs",
  "templates",
  "README.md",
  "LICENSE",
]);
let versions;
for (const template of ["panel", "sidebar", "command", "theme"]) {
  const pkg = JSON.parse(
    await readFile(join(root, "templates", template, "package.json"), "utf8"),
  );
  const actual = Object.fromEntries(
    ["@lomi-dev/plugin-sdk", "@lomi-dev/plugin-cli"].map((name) => [
      name,
      pkg.devDependencies[name],
    ]),
  );
  for (const version of Object.values(actual))
    assert.match(version, /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/);
  versions ??= actual;
  assert.deepEqual(actual, versions);
  assert.equal(pkg.scripts.dev, undefined);
  for (const spec of Object.values({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }))
    assert.doesNotMatch(spec, /^(file:|link:|workspace:|https?:|git)/);
}
console.log(
  "Generator syntax, package boundary and exact template dependencies passed.",
);
