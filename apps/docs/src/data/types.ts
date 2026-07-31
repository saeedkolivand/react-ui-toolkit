export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  /**
   * Set while a prop exists in React but not yet in the other three.
   *
   * There is one props table and four samples on a page, so an unmarked row
   * claims the prop in every framework. During the v2 migration React leads by
   * design, and a Vue reader must not be told an API they do not have. Clear the
   * flag when the last adapter lands.
   */
  reactFirst?: boolean;
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
  /**
   * The behaviour source shown beside the scope. Absent once a component is
   * rebuilt on the primitives in `@crosskit-ui/core`, which is the direction
   * every component is heading.
   */
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
