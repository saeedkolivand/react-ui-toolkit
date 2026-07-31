export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PartDoc {
  part: string;
  description: string;
}

/** A single v0 → v1 API change. Also the source MIGRATION.md is generated from. */
export interface ChangeDoc {
  from: string;
  to: string;
  note?: string;
}

export interface Samples {
  react: string;
  vue: string;
  svelte: string;
  angular: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  group: string;
  summary: string;
  /** The `data-scope` its DOM carries; the CSS hook consumers style against. */
  scope: string;
  /** Set when a zag machine drives it — what the component gets for free. */
  machine?: string;
  gains?: string[];
  props: PropDoc[];
  parts?: PartDoc[];
  changes?: ChangeDoc[];
  samples: Samples;
}

export const GROUPS = [
  "Getting started",
  "Primitives",
  "Layout",
  "Forms",
  "Overlays",
  "Disclosure",
  "Data display",
] as const;
