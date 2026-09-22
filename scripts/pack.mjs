import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const root = resolve(import.meta.dirname, "..");
export function run(command, args, cwd, options = {}) {
  const cli = command === "pnpm" ? process.env.npm_execpath : undefined;
  const env = { ...process.env };
  delete env.NODE_PATH;
  const result = spawnSync(
    cli ? process.execPath : command,
    cli ? [cli, ...args] : args,
    {
      cwd,
      env,
      encoding: "utf8",
      timeout: 180000,
      maxBuffer: 8 * 1024 * 1024,
      ...options,
    },
  );
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} (exit ${result.status})\n${result.stdout}\n${result.stderr}\n${result.error ?? ""}`,
    );
  return result.stdout;
}

export async function pack() {
  const metadata = JSON.parse(
    await readFile(join(root, "package.json"), "utf8"),
  );
  const output = join(root, "artifacts");
  await mkdir(output, { recursive: true });
  run("pnpm", ["pack", "--pack-destination", output], root);
  const file = `${metadata.name}-${metadata.version}.tgz`;
  const bytes = await readFile(join(output, file));
  const report = {
    schemaVersion: 1,
    sourceCommit: run("git", ["rev-parse", "HEAD"], root).trim(),
    name: metadata.name,
    version: metadata.version,
    file,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
  };
  await writeFile(
    join(output, "release.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  return { archive: join(output, file), report };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(JSON.stringify(await pack(), null, 2));
