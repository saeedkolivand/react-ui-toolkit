// Generates a README.md for each publishable package.
//
// npm renders the package README on the package page, and always includes it in
// the tarball regardless of `files`. All seven shipped 1.0.0 with none, so every
// page said only "no README available".
//
// Generated rather than hand-written for the same reason the migration guide is:
// seven near-identical documents drift, and the install line, the peer range and
// the component list are all facts already recorded elsewhere in the repo.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = path => JSON.parse(readFileSync(fileURLToPath(new URL(path, root)), "utf8"));

const DOCS = "https://crosskit.iamsaeed.dev";
const REPO = "https://github.com/saeedkolivand/crosskit";

const shared = name => `
## Documentation

Full component reference, with samples for all four frameworks:
**[${DOCS}/docs](${DOCS}/docs/)**

## Part of CrossKit

One component library with the same API in React, Vue, Svelte and Angular.
Behaviour lives in framework-free state machines shared across all four — so focus
traps, keyboard navigation and ARIA are written and tested once, not four times —
and styling in one precompiled stylesheet.

| | |
| --- | --- |
| \`@crosskit-ui/react\` | React 19 adapters |
| \`@crosskit-ui/vue\` | Vue 3.5 adapters |
| \`@crosskit-ui/svelte\` | Svelte 5 adapters |
| \`@crosskit-ui/angular\` | Angular 20–22 adapters |
| \`@crosskit-ui/styles\` | The visual layer, precompiled |
| \`@crosskit-ui/core\` | Framework-free shared logic |
| \`@crosskit-ui/zag-angular\` | Angular signals binding for Zag |

All seven move in lockstep, so there is never a version to match up by hand.

[Source](${REPO}) · [Migrating from react-ui-toolkit](${REPO}/blob/main/docs/migrating-from-react-ui-toolkit.md)

MIT © Saeed Kolivand
`;

const adapter = (framework, others, install, usage) => `
27 accessible components for ${framework}, with the same API as the ${others}
adapters.

\`\`\`bash
${install}
\`\`\`

\`\`\`${usage.lang}
${usage.code}
\`\`\`

The stylesheet is imported once, anywhere. Consumers need no Tailwind of their
own — it is an authoring tool in this repository, not a runtime dependency.

## Styling

Components emit \`data-scope\`, \`data-part\` and \`data-state\` — never a class name.
Your own \`class\` lands on the root untouched, and because everything ships inside
CSS cascade layers, **your unlayered rules win regardless of specificity**:

\`\`\`css
.my-button { background: rebeccapurple; }   /* beats the library, no !important */
\`\`\`

Retheming is ~48 semantic custom properties, and dark mode is one
\`[data-theme="dark"]\` block:

\`\`\`css
:root { --ck-accent-solid: #7c3aed; }
\`\`\`
`;

const PACKAGES = {
  react: {
    tagline: "CrossKit components for React.",
    body: adapter("React 19", "Vue, Svelte and Angular", "pnpm add @crosskit-ui/react", {
      lang: "tsx",
      code: `import { Button } from "@crosskit-ui/react";
import "@crosskit-ui/styles";

<Button variant="primary" icon="check" onClick={save}>
  Save changes
</Button>;`,
    }),
  },
  vue: {
    tagline: "CrossKit components for Vue.",
    body: adapter("Vue 3.5", "React, Svelte and Angular", "pnpm add @crosskit-ui/vue", {
      lang: "vue",
      code: `<script setup lang="ts">
import { Button } from "@crosskit-ui/vue";
import "@crosskit-ui/styles";
</script>

<template>
  <Button variant="primary" icon="check" @click="save">Save changes</Button>
</template>`,
    }),
  },
  svelte: {
    tagline: "CrossKit components for Svelte.",
    body: adapter("Svelte 5", "React, Vue and Angular", "pnpm add @crosskit-ui/svelte", {
      lang: "svelte",
      code: `<script lang="ts">
  import { Button } from "@crosskit-ui/svelte";
  import "@crosskit-ui/styles";
</script>

<Button variant="primary" icon="check" onclick={save}>Save changes</Button>`,
    }),
  },
  angular: {
    tagline: "CrossKit components for Angular.",
    body:
      adapter("Angular 20–22", "React, Vue and Svelte", "pnpm add @crosskit-ui/angular", {
        lang: "ts",
        code: `import { CkButton } from "@crosskit-ui/angular";

@Component({
  imports: [CkButton],
  template: \`
    <button ckButton variant="primary" icon="check" (click)="save()">
      Save changes
    </button>
  \`,
})
export class SaveComponent {}`,
      }) +
      `
The stylesheet goes in \`angular.json\` rather than a TypeScript import:

\`\`\`json
"styles": ["@crosskit-ui/styles", "src/styles.css"]
\`\`\`

Components use attribute selectors on native hosts where it makes sense
(\`button[ckButton]\`, \`svg[ckIcon]\`), so your own \`class\`, \`id\`, \`[routerLink]\` and
\`(click)\` land on a real element with no plumbing.
`,
  },
  styles: {
    tagline: "The CrossKit visual layer, precompiled.",
    body: `
One stylesheet for every CrossKit component, in every framework. Import it once:

\`\`\`ts
import "@crosskit-ui/styles";
\`\`\`

There is no JavaScript in this package and nothing to configure. **You do not need
Tailwind** — it is an authoring tool for this stylesheet, not a runtime dependency.

## How it is built

Selectors key off \`data-scope\`, \`data-part\` and \`data-state\`, never class names.
Everything ships inside named cascade layers:

\`\`\`css
@layer ck.reset, ck.tokens, ck.components, ck.overrides;
\`\`\`

Because **unlayered CSS beats layered CSS regardless of specificity**, your own
rules win without \`!important\`.

## Theming

About 48 semantic \`--ck-*\` custom properties are the public contract, and dark
mode is a single \`[data-theme="dark"]\` block rather than a variant duplicated
inside all 27 components.

\`\`\`css
:root {
  --ck-accent-solid: #7c3aed;
  --ck-radius-md: 2px;
}
\`\`\`

Tailwind users can opt into a bridge that maps utilities onto the same tokens, so
\`bg-primary-600\` and the components read one source of truth:

\`\`\`css
@import "@crosskit-ui/styles/theme.css";
\`\`\`
`,
  },
  core: {
    tagline: "Framework-free core for CrossKit.",
    body: `
The parts of CrossKit with no framework in them. Every adapter depends on this;
you rarely need it directly, but nothing here requires React, Vue, Svelte or
Angular to run.

\`\`\`ts
import { createToaster, getPageWindow, iconPaths, resolvePlacement } from "@crosskit-ui/core";
\`\`\`

| Export | What it is |
| --- | --- |
| \`iconPaths\`, \`ICON_NAMES\` | 104 icons as path data, not components |
| \`createToaster\` | The toast store — a plain singleton, no provider |
| \`createTableStore\` | \`@tanstack/table-core\` bound once for all four adapters |
| \`getPageWindow\` | Pagination windowing, so a 500-row table renders a handful of page buttons |
| \`toColumnDefs\`, \`fromLegacyColumns\` | Serialisable column definitions, and a migration helper |
| \`resolvePlacement\` | Floating UI placements, accepting the older Ant names too |
| \`dataAttr\`, \`ariaAttr\` | Booleans as presence attributes, never \`="false"\` |
`,
  },
  "zag-angular": {
    tagline: "Angular signals binding for Zag.js.",
    body: `
Drives [Zag.js](https://zagjs.com) state machines from Angular signals. Zag ships
official React, Vue, Solid and Svelte adapters but none for Angular; this is that
adapter, and it is useful on its own — you do not need the rest of CrossKit.

\`\`\`ts
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, ZagSpread } from "@crosskit-ui/zag-angular";

export class MyDialog {
  // A FIELD INITIALIZER: this is the only injection context available.
  private readonly service = useMachine(dialog.machine, () => ({ id: "d1" }));
  protected readonly api = computed(() => dialog.connect(this.service, normalizeProps));
}
\`\`\`

\`\`\`html
<div [zagSpread]="api().getContentProps()">...</div>
\`\`\`

Ported from \`@zag-js/svelte\` rather than the React adapter, because runes map onto
signals almost one to one. Zoneless, SSR-safe, and verified against a real
Playwright suite: focus trap wrapping both directions, focus restore, controlled
round-trips, portalling and exit animations.

Three things it has to get right that are not obvious:

- **\`bindable\` seeds on first use, not at construction.** A machine is built in a
  field initializer, before Angular applies inputs — seeding earlier snapshots
  every \`default*\` prop as \`undefined\`.
- **\`track\` defers out of change detection.** Angular effects run inside
  \`ApplicationRef.tick()\`, so flushing from one throws NG0101 and silently does
  nothing, leaving machine effects to resolve against a stale DOM.
- **\`ZagSpread\` removes stale attributes.** \`data-state\` toggling *is* the styling
  system, so an add-only spread leaves \`data-state="open"\` stuck forever.
`,
  },
};

let written = 0;
for (const [name, { tagline, body }] of Object.entries(PACKAGES)) {
  const pkg = read(`packages/${name}/package.json`);
  const doc = `# ${pkg.name}\n\n${tagline}\n${body}${shared(name)}`.replace(/\n{3,}/g, "\n\n");
  writeFileSync(fileURLToPath(new URL(`packages/${name}/README.md`, root)), doc, "utf8");
  written++;
}
console.log(`wrote ${written} package READMEs`);
