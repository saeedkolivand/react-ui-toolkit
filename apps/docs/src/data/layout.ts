import type { ComponentDoc } from "./types";

export const layout: ComponentDoc[] = [
  {
    slug: "container",
    name: "Container",
    group: "Layout",
    scope: "container",
    summary: "A max-width wrapper that centres its content.",
    props: [
      {
        name: "maxWidth",
        type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"',
        default: '"lg"',
        description: "Width cap.",
      },
      { name: "padding", type: "boolean", default: "true", description: "Horizontal gutters." },
      { name: "center", type: "boolean", default: "true", description: "Auto side margins." },
    ],
    samples: {
      react: `import { Container } from "@crosskit-ui/react";

<Container maxWidth="lg">…</Container>`,
      vue: `<script setup lang="ts">
import { Container } from "@crosskit-ui/vue";
</script>

<template>
  <Container max-width="lg">…</Container>
</template>`,
      svelte: `<script lang="ts">
  import { Container } from "@crosskit-ui/svelte";
</script>

<Container maxWidth="lg">…</Container>`,
      angular: `import { CkContainer } from "@crosskit-ui/angular";

@Component({
  imports: [CkContainer],
  template: \`<ck-container maxWidth="lg">…</ck-container>\`,
})
export class Demo {}`,
    },
  },
  {
    slug: "row",
    name: "Row",
    group: "Layout",
    scope: "row",
    summary:
      "A flex row with a 12-column grid inside. `spacing` is unbounded, so it ships as an inline custom property rather than a data attribute — see the CSP note below.",
    props: [
      {
        name: "justify",
        type: '"start" | "center" | "end" | "between" | "around" | "evenly"',
        default: '"start"',
        description: "Main-axis distribution.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end" | "stretch" | "baseline"',
        default: '"stretch"',
        description: "Cross-axis alignment.",
      },
      {
        name: "spacing",
        type: "number",
        default: "0",
        description:
          "Gutter in 0.25rem steps. Written as --ck-row-spacing inline; a strict CSP needs style-src-attr 'unsafe-inline'.",
      },
      { name: "wrap", type: "boolean", default: "true", description: "Allow wrapping." },
      { name: "reverse", type: "boolean", default: "false", description: "Reverse the order." },
    ],
    changes: [
      {
        from: "gap-${spacing} class",
        to: "--ck-row-spacing custom property",
        note: "The old dynamic class name only ever worked inside this repo's own Tailwind build.",
      },
    ],
    samples: {
      react: `import { Row, Col } from "@crosskit-ui/react";

<Row spacing={4}>
  <Col span={8}>main</Col>
  <Col span={4}>aside</Col>
</Row>`,
      vue: `<script setup lang="ts">
import { Row, Col } from "@crosskit-ui/vue";
</script>

<template>
  <Row :spacing="4">
    <Col :span="8">main</Col>
    <Col :span="4">aside</Col>
  </Row>
</template>`,
      svelte: `<script lang="ts">
  import { Row, Col } from "@crosskit-ui/svelte";
</script>

<Row spacing={4}>
  <Col span={8}>main</Col>
  <Col span={4}>aside</Col>
</Row>`,
      angular: `import { CkRow, CkCol } from "@crosskit-ui/angular";

@Component({
  imports: [CkRow, CkCol],
  template: \`
    <ck-row [spacing]="4">
      <ck-col [span]="8">main</ck-col>
      <ck-col [span]="4">aside</ck-col>
    </ck-row>
  \`,
})
export class Demo {}`,
    },
  },
  {
    slug: "col",
    name: "Col",
    group: "Layout",
    scope: "col",
    summary:
      "A 12-column grid cell with per-breakpoint spans. `offset` works here — in v0 it emitted `ml-${n}/12`, which is not valid Tailwind, so it and all four `*Offset` props were silently no-ops.",
    props: [
      { name: "span", type: "1–12", description: "Columns occupied at every breakpoint." },
      { name: "offset", type: "1–11", description: "Columns skipped before the cell." },
      {
        name: "sm | md | lg | xl",
        type: "{ span?, offset? }",
        description: "Per-breakpoint overrides.",
      },
      {
        name: "order",
        type: 'number | "first" | "last"',
        description: "Visual order. Written as --ck-col-order inline.",
      },
    ],
    changes: [
      {
        from: "offset / smOffset / mdOffset / lgOffset",
        to: "offset, and { offset } inside each breakpoint object",
        note: "These are newly functional — they never did anything in v0.",
      },
    ],
    samples: {
      react: `<Col span={12} md={{ span: 6 }} lg={{ span: 4, offset: 1 }}>
  cell
</Col>`,
      vue: `<Col :span="12" :md="{ span: 6 }" :lg="{ span: 4, offset: 1 }">cell</Col>`,
      svelte: `<Col span={12} md={{ span: 6 }} lg={{ span: 4, offset: 1 }}>cell</Col>`,
      angular: `<ck-col [span]="12" [md]="{ span: 6 }" [lg]="{ span: 4, offset: 1 }">
  cell
</ck-col>`,
    },
  },
];
