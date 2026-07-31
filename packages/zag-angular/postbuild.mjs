// Fix up the manifest ng-packagr emits into dist/.
//
// 1. `publishConfig.directory: "dist"` is correct at the package ROOT (it tells
//    pnpm what to pack) but poisonous inside dist/, where it makes pnpm and
//    publint look for dist/dist. Same failure shape as changesets#773.
// 2. ng-packagr copies `workspace:^` dependency ranges verbatim. pnpm resolves
//    those at publish time from the workspace root, but anything operating on
//    dist/ standalone (publint, a manual pack) cannot. Since versioning is
//    fixed/lockstep, every @crosskit-ui/* package shares this version, so the
//    range resolves to ^<own version>.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const manifest = join(here, "dist", "package.json");
const pkg = JSON.parse(readFileSync(manifest, "utf8"));

let changed = false;

if (pkg.publishConfig?.directory) {
  delete pkg.publishConfig.directory;
  changed = true;
}

for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
  const deps = pkg[field];
  if (!deps) continue;
  for (const [name, range] of Object.entries(deps)) {
    if (typeof range === "string" && range.startsWith("workspace:")) {
      const suffix = range.slice("workspace:".length);
      // workspace:^ / workspace:~ / workspace:* -> a real range on our version
      deps[name] = suffix === "*" ? pkg.version : `${suffix}${pkg.version}`;
      changed = true;
    }
  }
}

if (changed) {
  writeFileSync(manifest, JSON.stringify(pkg, null, 2) + "\n");
  console.log("normalised dist/package.json (publishConfig.directory, workspace: ranges)");
}
