import type { ComponentDoc } from "./types";
import { primitives } from "./primitives";
import { layout } from "./layout";
import { forms } from "./forms";
import { overlays } from "./overlays";
import { disclosure } from "./disclosure";
import { dataDisplay } from "./data-display";

/**
 * One registry, three consumers: the sidebar, the per-component pages, and
 * MIGRATION.md — which is generated from the `changes` entries rather than
 * written twice and left to drift.
 */
export const components: ComponentDoc[] = [
  ...primitives,
  ...layout,
  ...forms,
  ...overlays,
  ...disclosure,
  ...dataDisplay,
];

export const byGroup = (): Array<{ group: string; items: ComponentDoc[] }> => {
  const seen: string[] = [];
  for (const c of components) if (!seen.includes(c.group)) seen.push(c.group);
  return seen.map(group => ({ group, items: components.filter(c => c.group === group) }));
};

export type { ComponentDoc } from "./types";
