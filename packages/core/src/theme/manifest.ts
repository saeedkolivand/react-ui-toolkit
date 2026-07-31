/**
 * Variant manifests: what each component's `ownerState` can actually be.
 *
 * This is the single source of truth for three separate things — the theme
 * compiler enumerates it to turn style functions into static CSS, the docs
 * generate their prop tables from it, and the parity fixtures render from it.
 * Keeping one copy is what stops those three drifting apart.
 *
 * Only *enumerable* dimensions belong here. Continuous values (a progress
 * percentage, a grid gutter) cannot be enumerated and stay inline custom
 * properties, exactly as they already are.
 */

export interface ComponentManifest {
  /** The `data-scope` value every part of this component carries. */
  scope: string;
  /** Every `data-part` a style override may target. */
  parts: readonly string[];
  /**
   * Enumerable dimensions, keyed by the data attribute they render as.
   * `size: ["small", "middle", "large"]` becomes `data-size`.
   */
  variants: Record<string, readonly string[]>;
  /** Which value of each variant is the default, and so needs no attribute selector. */
  defaults: Record<string, string>;
}

/** `{ type: ["a","b"], size: ["s","m"] }` → every combination, in declaration order. */
export function variantCombinations(
  variants: Record<string, readonly string[]>
): Array<Record<string, string>> {
  return Object.entries(variants).reduce<Array<Record<string, string>>>(
    (acc, [name, values]) =>
      acc.flatMap(combo => values.map(value => ({ ...combo, [name]: value }))),
    [{}]
  );
}

/**
 * Manifests for the components that exist so far. Each one is added alongside
 * its component rather than up front, so this file never describes something
 * that has not shipped.
 */
export const manifests: Record<string, ComponentManifest> = {
  Button: {
    scope: "button",
    parts: ["root", "label", "icon", "spinner"],
    // Only enumerable dimensions. `danger`, `ghost`, `block`, `loading` and
    // `disabled` are booleans, which render as presence attributes -- so they
    // are targeted with a nested key like `"&[data-danger]"`, never declared
    // here. `compileOverrides` throws on a "true"/"false" variant for exactly
    // that reason.
    variants: {
      type: ["default", "primary", "dashed", "text", "link"],
      size: ["small", "middle", "large"],
    },
    defaults: { type: "default", size: "middle" },
  },
};
