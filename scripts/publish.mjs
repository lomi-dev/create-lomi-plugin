import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { root, run } from "./pack.mjs";

const metadata = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const report = JSON.parse(
  await readFile(join(root, "artifacts/release.json"), "utf8"),
);
const validation = JSON.parse(
  await readFile(join(root, "artifacts/archive-validation.json"), "utf8"),
);
assert.equal(report.sourceCommit, process.env.GITHUB_SHA);
assert.equal(validation.sourceCommit, report.sourceCommit);
assert.deepEqual(validation.archive, report);
assert.deepEqual(
  validation.results.map((result) => result.template),
  ["panel", "sidebar", "command", "theme"],
);
assert.equal(report.name, metadata.name);
assert.equal(report.version, metadata.version);
assert.match(metadata.version, /^\d+\.\d+\.\d+-[a-zA-Z0-9.-]+$/);
assert.equal(report.file, `${metadata.name}-${metadata.version}.tgz`);
const path = join(root, "artifacts", report.file);
const bytes = await readFile(path);
assert.equal(createHash("sha256").update(bytes).digest("hex"), report.sha256);
assert.equal(
  `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
  report.integrity,
);
console.log(
  run(
    "npm",
    [
      "publish",
      path,
      "--access",
      "public",
      "--tag",
      "next",
      "--ignore-scripts",
      "--provenance",
      ...(process.argv.includes("--dry-run") ? ["--dry-run"] : []),
    ],
    root,
  ),
);
