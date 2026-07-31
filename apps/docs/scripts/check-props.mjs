// Fails if the docs describe a prop that no React adapter declares.
//
// The registry is written by hand, so it drifts: Tag was documented with a
// `size` and an `onRemove` it has never had, and Badge with a `dot`. Nothing
// caught that, because prose cannot be typechecked. This can.
//
// It is deliberately one-directional — a prop that exists but is undocumented
// is a gap, not a lie, and plenty of native passthrough props are intentionally
// left out.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const groups = ["primitives", "layout", "forms", "overlays", "disclosure", "data-display"];
const docs = [];
for (const g of groups) {
  const mod = await import(new URL(`../src/data/${g}.ts`, import.meta.url).href);
  docs.push(...Object.values(mod)[0]);
}

// Every prop name the React adapters actually declare.
const files = [];
const walk = dir => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")) files.push(p);
  }
};
// Resolved from this file, not from cwd: turbo runs package scripts with the
// package as cwd, so a repo-relative path only works when run from the root.
const REACT_SRC = fileURLToPath(new URL("../../../packages/react/src/", import.meta.url));
walk(REACT_SRC);
const declared = new Set();
for (const file of files) {
  for (const m of readFileSync(file, "utf8").matchAll(/^\s{2}(\w+)\??[?]?:/gm)) declared.add(m[1]);
}

let bad = 0;
for (const component of docs) {
  const missing = component.props
    // `reactRemoved` rows document a prop the other three adapters still have
    // and React has already replaced. Every name here is checked against the
    // React adapters only, so such a row would always report missing — which is
    // true and not a defect. Removing the row instead would leave a Vue reader
    // with no documentation for a prop they still pass.
    .filter(p => !p.reactRemoved)
    // Split on commas as well as spaces: a row can list several props at once
    // ("open, defaultOpen, onOpenChange"), and splitting on spaces alone yielded
    // "open," — which the identifier filter then rejected, so every name in such
    // a row was skipped rather than checked.
    .flatMap(p => p.name.split(/[,\s]+/).map(n => n.split(".").pop().trim()))
    .filter(n => /^[a-z]\w*$/.test(n) && !declared.has(n));
  if (missing.length) {
    bad += missing.length;
    console.log(`${component.name}: ${missing.join(", ")}`);
  }
}
console.log(bad ? `\n${bad} documented props do not exist` : "\nevery documented prop exists");
