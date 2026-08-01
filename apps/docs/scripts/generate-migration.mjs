// Generates docs/migrating-from-react-ui-toolkit.md from the docs registry.
//
// The per-component pages and the migration guide describe the same API changes,
// so they read from one source. Written by hand in both places they would drift
// on the first rename nobody remembered to mirror.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Node 22 strips TypeScript types natively, so the .ts registry imports with no
// loader and no dependency. tsx would also work, but adding it re-resolved the
// lockfile and left @crosskit-ui/react importing Storybook's bundled
// @vitest/expect@3 instead of its own @4 — which broke snapshots with a message
// naming neither package.
// Imported file by file with explicit .ts extensions: Node's stripper does not
// do extension-less resolution, and index.ts is written for Astro, which does.
const groups = await Promise.all(
  ["primitives", "layout", "forms", "overlays", "disclosure", "data-display"].map(
    name => import(`../src/data/${name}.ts`)
  )
);
const components = groups.flatMap(module => Object.values(module)[0]);
const byGroup = () => {
  const seen = [];
  for (const component of components)
    if (!seen.includes(component.group)) seen.push(component.group);
  return seen.map(group => ({ group, items: components.filter(c => c.group === group) }));
};

const escape = value => String(value).replace(/\|/g, "\\|");

const lines = [
  "# Migrating from `@saeedkolivand/react-ui-toolkit`",
  "",
  "<!-- GENERATED FILE — edit apps/docs/src/data/*.ts and run `pnpm --filter @crosskit-ui/docs gen:migration`. -->",
  "",
  "CrossKit is a clean break, not a rename with a compatibility shim. The",
  "component set is the same 27 you had; what changed is that behaviour is now",
  "written once and shared across four frameworks, and styling comes from one",
  "precompiled stylesheet keyed to data attributes.",
  "",
  "## The four things that affect every file",
  "",
  "1. **Scope rename.** `@saeedkolivand/react-ui-toolkit` becomes `@crosskit-ui/react`",
  "   (or `/vue`, `/svelte`, `/angular`).",
  '2. **One stylesheet.** `import "@crosskit-ui/styles"` replaces importing',
  "   `dist/styles.css`. `withStyles`, `withStylesSSR`, `StylesProvider` and",
  "   `StylesProviderSSR` are deleted, not renamed — styling is that one import.",
  '3. **Dark mode.** The `dark` class becomes `[data-theme="dark"]` on `<html>`.',
  "   `Notification.module.css` already had nine `[data-theme]` rules that nothing",
  "   ever set, so its dark mode had never worked; this revives that dead path.",
  "4. **No class names in markup.** Components emit `data-scope` / `data-part` /",
  "   `data-state`. Your own `class` still lands on the root, untouched, and",
  "   because everything shipped sits in a CSS cascade layer your unlayered rules",
  "   win regardless of specificity.",
  "",
  "## Bugs this fixes",
  "",
  "These were real defects in v0, not stylistic changes. If you worked around any",
  "of them, remove the workaround:",
  "",
  "- **Select ignored `<Option>` children.** They were destructured into `_children`",
  "  and never rendered, which is why `Table`'s `showSizeChanger` produced an empty",
  "  dropdown.",
  "- **Switch fired two different event shapes**, and which one you got depended on",
  "  where you clicked.",
  "- **Four components threw under SSR** — Modal, Select, Drawer and Dropdown all",
  "  called `createPortal` during render.",
  "- **Two ARIA references pointed at nothing**: Modal's `aria-labelledby` and",
  "  Tabs' `aria-labelledby={`tab-${index}`}`.",
  "- **`Col.offset` and every `*Offset` prop did nothing.** They emitted",
  "  `ml-${n}/12`, which is not valid Tailwind. They work now.",
  "- **Table's sortable header was not keyboard-operable** — a bare click handler,",
  "  no tabindex, no role, no Enter handler.",
  "- **Table rendered one button per page** — fifty of them for 500 rows.",
  "",
  "## Component-by-component",
  "",
];

for (const { group, items } of byGroup()) {
  const withChanges = items.filter(item => item.changes?.length);
  if (!withChanges.length) continue;
  lines.push(`### ${group}`, "");
  for (const item of withChanges) {
    lines.push(`#### ${item.name}`, "");
    lines.push("| v0 | v1 | Notes |", "| --- | --- | --- |");
    for (const change of item.changes) {
      lines.push(
        `| \`${escape(change.from)}\` | \`${escape(change.to)}\` | ${escape(change.note ?? "")} |`
      );
    }
    lines.push("");
  }
}

// `isNew` components are excluded rather than merely lacking `changes`:
// having nothing to migrate and having never existed read identically to
// this filter, and only one of them belongs under a heading about kept
// prop names.
const unchanged = components.filter(c => !c.changes?.length && !c.isNew).map(c => c.name);
const added = components.filter(c => c.isNew).map(c => c.name);
lines.push(
  "## Unchanged APIs",
  "",
  "These components kept their v0 prop names, so only the import path changes:",
  "",
  unchanged.map(name => `\`${name}\``).join(", ") + ".",
  "",
  ...(added.length
    ? [
        "## New, with no v0 equivalent",
        "",
        "Nothing to migrate \u2014 these did not exist before:",
        "",
        added.map(name => `\`${name}\``).join(", ") + ".",
        "",
      ]
    : []),
  "## Deleted, not renamed",
  "",
  "| Removed | Replacement |",
  "| --- | --- |",
  '| `withStyles`, `withStylesSSR` | `import "@crosskit-ui/styles"` |',
  "| `StylesProvider`, `StylesProviderSSR` | same |",
  "| `useIsHydrated` | nothing — the theme controller's server snapshot covers it |",
  "| `NotificationProvider`, `useNotification` | `createToaster()` + `<Toaster>` |",
  "| `utils/position.ts` | the shared behaviour core |",
  ""
);

const out = fileURLToPath(
  new URL("../../../docs/migrating-from-react-ui-toolkit.md", import.meta.url)
);
const generated = lines.join("\n");

// `--check` exists so the committed guide cannot drift from this registry
// unnoticed. It did: two rounds of prop renames landed with the file
// untouched, because regenerating it was a command somebody had to remember
// to run. Wired into the docs `typecheck`, which the gate already runs.
if (process.argv.includes("--check")) {
  const current = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (current !== generated) {
    console.error(
      out +
        " is out of date. Run: pnpm --filter @crosskit-ui/docs gen:migration, and commit the result."
    );
    process.exit(1);
  }
  console.log("migration guide is up to date");
} else {
  writeFileSync(out, generated, "utf8");
  console.log(`wrote ${out}`);
}
