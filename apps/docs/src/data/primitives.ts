import type { ComponentDoc } from "./types";

export const primitives: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    group: "Primitives",
    scope: "button",
    summary:
      "The template every presentational component copies. Eight variants, three sizes, an optional icon and a loading state — all of it selected by data attributes, none of it by class names.",
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "success" | "error" | "warning" | "info"',
        default: '"primary"',
        description: "Visual style. Lands on the root as data-variant.",
      },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control size." },
      { name: "icon", type: "IconName", description: "Icon rendered before the label." },
      {
        name: "iconPosition",
        type: '"start" | "end"',
        default: '"start"',
        description: "Which side the icon sits on.",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Swaps the icon for a spinner and disables interaction.",
      },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches to 100%." },
      {
        name: "type",
        type: '"button" | "submit" | "reset"',
        default: '"button"',
        description:
          "Defaults to button. v0 set none at all, so a Button inside a form silently submitted it.",
      },
    ],
    changes: [
      {
        from: "no default type",
        to: 'type="button"',
        note: 'A Button inside a form used to submit it. Pass type="submit" if you want the old behaviour.',
      },
    ],
    samples: {
      react: `import { Button } from "@crosskit-ui/react";
import "@crosskit-ui/styles";

<Button variant="primary" icon="check" onClick={save}>
  Save changes
</Button>`,
      vue: `<script setup lang="ts">
import { Button } from "@crosskit-ui/vue";
import "@crosskit-ui/styles";
</script>

<template>
  <Button variant="primary" icon="check" @click="save">Save changes</Button>
</template>`,
      svelte: `<script lang="ts">
  import { Button } from "@crosskit-ui/svelte";
  import "@crosskit-ui/styles";
</script>

<Button variant="primary" icon="check" onclick={save}>Save changes</Button>`,
      angular: `import { CkButton } from "@crosskit-ui/angular";

@Component({
  imports: [CkButton],
  template: \`
    <button ckButton variant="primary" icon="check" (click)="save()">
      Save changes
    </button>
  \`,
})
export class SaveComponent {}`,
    },
  },
  {
    slug: "icon",
    name: "Icon",
    group: "Primitives",
    scope: "icon",
    summary:
      "104 icons as path data, not components. Presentation attributes (fill, stroke-width, linecap) live in CSS, which is why the markup is byte-identical in all four frameworks.",
    props: [
      { name: "name", type: "IconName", description: "One of the 104 icon names." },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Icon size.",
      },
    ],
    samples: {
      react: `import { Icon } from "@crosskit-ui/react";

<Icon name="rocket" size="lg" />`,
      vue: `<script setup lang="ts">
import { Icon } from "@crosskit-ui/vue";
</script>

<template>
  <Icon name="rocket" size="lg" />
</template>`,
      svelte: `<script lang="ts">
  import { Icon } from "@crosskit-ui/svelte";
</script>

<Icon name="rocket" size="lg" />`,
      angular: `import { CkIcon } from "@crosskit-ui/angular";

@Component({
  imports: [CkIcon],
  template: \`<svg ckIcon name="rocket" size="lg"></svg>\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "spinner",
    name: "Spinner",
    group: "Primitives",
    scope: "spinner",
    summary: "A pure-CSS loading indicator. No JavaScript, no animation library.",
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Spinner size." },
      {
        name: "variant",
        type: '"primary" | "neutral" | "current"',
        default: '"current"',
        description: "Colour source. `current` inherits from the surrounding text.",
      },
      {
        name: "label",
        type: "string",
        default: '"Loading"',
        description: "Accessible name announced by screen readers.",
      },
    ],
    samples: {
      react: `import { Spinner } from "@crosskit-ui/react";

<Spinner size="lg" />`,
      vue: `<script setup lang="ts">
import { Spinner } from "@crosskit-ui/vue";
</script>

<template>
  <Spinner size="lg" />
</template>`,
      svelte: `<script lang="ts">
  import { Spinner } from "@crosskit-ui/svelte";
</script>

<Spinner size="lg" />`,
      angular: `import { CkSpinner } from "@crosskit-ui/angular";

@Component({
  imports: [CkSpinner],
  template: \`<ck-spinner size="lg" />\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "divider",
    name: "Divider",
    group: "Primitives",
    scope: "divider",
    summary: "A separator, horizontal or vertical, optionally with a label in the middle.",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Axis.",
      },
      { name: "label", type: "ReactNode", description: "Text centred in the rule." },
    ],
    samples: {
      react: `import { Divider } from "@crosskit-ui/react";

<Divider label="or" />`,
      vue: `<script setup lang="ts">
import { Divider } from "@crosskit-ui/vue";
</script>

<template>
  <Divider label="or" />
</template>`,
      svelte: `<script lang="ts">
  import { Divider } from "@crosskit-ui/svelte";
</script>

<Divider label="or" />`,
      angular: `import { CkDivider } from "@crosskit-ui/angular";

@Component({
  imports: [CkDivider],
  template: \`<ck-divider label="or" />\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "badge",
    name: "Badge",
    group: "Primitives",
    scope: "badge",
    summary: "A small status pill. Count, dot, or label.",
    props: [
      {
        name: "variant",
        type: '"primary" | "neutral" | "success" | "error" | "warning" | "info"',
        default: '"neutral"',
        description: "Colour.",
      },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Badge size." },
      { name: "dot", type: "boolean", default: "false", description: "Renders as a bare dot." },
    ],
    samples: {
      react: `import { Badge } from "@crosskit-ui/react";

<Badge variant="success">Active</Badge>`,
      vue: `<script setup lang="ts">
import { Badge } from "@crosskit-ui/vue";
</script>

<template>
  <Badge variant="success">Active</Badge>
</template>`,
      svelte: `<script lang="ts">
  import { Badge } from "@crosskit-ui/svelte";
</script>

<Badge variant="success">Active</Badge>`,
      angular: `import { CkBadge } from "@crosskit-ui/angular";

@Component({
  imports: [CkBadge],
  template: \`<span ckBadge variant="success">Active</span>\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "tag",
    name: "Tag",
    group: "Primitives",
    scope: "tag",
    summary: "A labelled chip, optionally removable.",
    props: [
      {
        name: "color",
        type: '"neutral" | "primary" | "success" | "error" | "warning" | "info"',
        default: '"neutral"',
        description: "Colour.",
      },
      {
        name: "variant",
        type: '"solid" | "subtle" | "outline"',
        default: '"subtle"',
        description: "Fill style.",
      },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Tag size." },
      { name: "onRemove", type: "() => void", description: "Renders a remove button when given." },
    ],
    samples: {
      react: `import { Tag } from "@crosskit-ui/react";

<Tag color="primary" onRemove={() => drop(id)}>
  design
</Tag>`,
      vue: `<script setup lang="ts">
import { Tag } from "@crosskit-ui/vue";
</script>

<template>
  <Tag color="primary" @remove="drop(id)">design</Tag>
</template>`,
      svelte: `<script lang="ts">
  import { Tag } from "@crosskit-ui/svelte";
</script>

<Tag color="primary" onRemove={() => drop(id)}>design</Tag>`,
      angular: `import { CkTag } from "@crosskit-ui/angular";

@Component({
  imports: [CkTag],
  template: \`<ck-tag color="primary" (remove)="drop(id)">design</ck-tag>\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "card",
    name: "Card",
    group: "Primitives",
    scope: "card",
    summary: "A surface with padding and an optional border or shadow.",
    props: [
      {
        name: "variant",
        type: '"elevated" | "outline" | "filled"',
        default: '"elevated"',
        description: "Surface treatment.",
      },
      {
        name: "padding",
        type: '"none" | "sm" | "md" | "lg"',
        default: '"md"',
        description: "Inner spacing.",
      },
    ],
    samples: {
      react: `import { Card } from "@crosskit-ui/react";

<Card variant="outline">Anything at all</Card>`,
      vue: `<script setup lang="ts">
import { Card } from "@crosskit-ui/vue";
</script>

<template>
  <Card variant="outline">Anything at all</Card>
</template>`,
      svelte: `<script lang="ts">
  import { Card } from "@crosskit-ui/svelte";
</script>

<Card variant="outline">Anything at all</Card>`,
      angular: `import { CkCard } from "@crosskit-ui/angular";

@Component({
  imports: [CkCard],
  template: \`<ck-card variant="outline">Anything at all</ck-card>\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "alert",
    name: "Alert",
    group: "Primitives",
    scope: "alert",
    summary:
      "An inline status message. The first composition in the library — its icon is an Icon, and proving the child's own data-part survived was the point.",
    props: [
      {
        name: "variant",
        type: '"info" | "success" | "warning" | "error"',
        default: '"info"',
        description: "Status.",
      },
      { name: "title", type: "ReactNode", description: "Bold heading above the body." },
      { name: "showIcon", type: "boolean", default: "true", description: "Status icon." },
      {
        name: "dismissible",
        type: "boolean",
        default: "false",
        description: "Renders a close button.",
      },
      { name: "onDismiss", type: "() => void", description: "Called when dismissed." },
    ],
    samples: {
      react: `import { Alert } from "@crosskit-ui/react";

<Alert variant="warning" title="Heads up" dismissible onDismiss={hide}>
  Your trial ends in three days.
</Alert>`,
      vue: `<script setup lang="ts">
import { Alert } from "@crosskit-ui/vue";
</script>

<template>
  <Alert variant="warning" title="Heads up" dismissible @dismiss="hide">
    Your trial ends in three days.
  </Alert>
</template>`,
      svelte: `<script lang="ts">
  import { Alert } from "@crosskit-ui/svelte";
</script>

<Alert variant="warning" title="Heads up" dismissible onDismiss={hide}>
  Your trial ends in three days.
</Alert>`,
      angular: `import { CkAlert } from "@crosskit-ui/angular";

@Component({
  imports: [CkAlert],
  template: \`
    <ck-alert variant="warning" title="Heads up" dismissible (dismiss)="hide()">
      Your trial ends in three days.
    </ck-alert>
  \`,
})
export class Demo {}`,
    },
  },
];
