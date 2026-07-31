/**
 * Turns `styleOverrides` into static CSS.
 *
 * The authoring API is a function of `(theme, ownerState)` — the same shape a
 * runtime style engine would take. The difference is when it runs: once per
 * variant combination at `createTheme()` time, rather than once per component
 * instance at render time. Since every dimension of `ownerState` is enumerable
 * and declared in the manifest, the whole input space is known up front, so
 * running it eagerly loses nothing and costs nothing at runtime.
 *
 * What that does not cover is a style branching on a value which is not
 * enumerable — a progress percentage, a grid gutter. Those are inline custom
 * properties already, and it is the one documented boundary of this API.
 */

import { variantCombinations, type ComponentManifest } from "./manifest";

/** A style object: declarations, plus nested `&`-relative or at-rule blocks. */
export interface StyleObject {
  [property: string]: string | number | StyleObject | undefined;
}

export type StyleOverride<Theme, OwnerState> =
  StyleObject | ((context: { theme: Theme; ownerState: OwnerState }) => StyleObject);

/**
 * Properties whose numeric values are not lengths. Everything else gets `px`,
 * which is what makes `padding: 8` mean what it looks like it means.
 */
const UNITLESS = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
  "gridColumn",
  "gridRow",
  "gridColumnStart",
  "gridColumnEnd",
  "gridRowStart",
  "gridRowEnd",
  "columnCount",
  "aspectRatio",
  "scale",
]);

const kebab = (property: string) =>
  // Leave custom properties alone: `--ck-Foo` is a different property from
  // `--ck-foo`, so case-folding one would silently target nothing.
  property.startsWith("--") ? property : property.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

const value = (property: string, raw: string | number) =>
  typeof raw === "number" && raw !== 0 && !UNITLESS.has(property) ? `${raw}px` : String(raw);

const isStyleObject = (v: unknown): v is StyleObject =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export interface Rule {
  selector: string;
  /** Wrapping at-rules, outermost first, e.g. `["@media (min-width: 40em)"]`. */
  conditions: string[];
  declarations: string[];
}

/**
 * Flattens a style object into rules. `&` in a nested key is replaced by the
 * parent selector, which is what lets `"&:hover"` and `"& [data-part=icon]"`
 * work without the compiler needing to know about pseudo-classes at all.
 */
export function flattenStyle(
  style: StyleObject,
  selector: string,
  conditions: string[] = []
): Rule[] {
  const declarations: string[] = [];
  const nested: Rule[] = [];

  for (const [key, raw] of Object.entries(style)) {
    if (raw === undefined) continue;

    if (isStyleObject(raw)) {
      if (key.startsWith("@")) {
        nested.push(...flattenStyle(raw, selector, [...conditions, key]));
      } else {
        // A key without `&` is treated as a descendant, matching how nesting
        // reads in plain CSS.
        const child = key.includes("&") ? key.replace(/&/g, selector) : `${selector} ${key}`;
        nested.push(...flattenStyle(raw, child, conditions));
      }
      continue;
    }

    declarations.push(`${kebab(key)}: ${value(key, raw)}`);
  }

  const own = declarations.length ? [{ selector, conditions, declarations }] : [];
  return [...own, ...nested];
}

/** Declarations present in `next` that `base` does not already produce. */
function diff(base: Rule[], next: Rule[]): Rule[] {
  const seen = new Set(
    base.flatMap(r => r.declarations.map(d => `${r.conditions.join("|")}||${r.selector}||${d}`))
  );
  return next
    .map(r => ({
      ...r,
      declarations: r.declarations.filter(
        d => !seen.has(`${r.conditions.join("|")}||${stripVariants(r.selector)}||${d}`)
      ),
    }))
    .filter(r => r.declarations.length > 0);
}

/** Drops the variant attribute selectors, so a rule can be compared to its base. */
const stripVariants = (selector: string) =>
  selector.replace(/\[data-(?!scope|part)[a-z-]+="[^"]*"\]/g, "");

export function serializeRules(rules: Rule[]): string {
  return rules
    .map(({ selector, conditions, declarations }) => {
      let out = `${selector} { ${declarations.join("; ")} }`;
      for (const condition of [...conditions].reverse()) out = `${condition} { ${out} }`;
      return out;
    })
    .join("\n");
}

/** A comparable fingerprint of what a style function produced. */
const fingerprint = (style: StyleObject) =>
  JSON.stringify(flattenStyle(style, "&").map(r => [r.conditions, r.selector, r.declarations]));

/**
 * Which variant dimensions this style function actually reads.
 *
 * Without this, a style that only branches on `type` still emits one rule per
 * `size` — the same declarations repeated across the whole cross product. That
 * is dead weight in a stylesheet every consumer downloads, and it multiplies
 * with each dimension a component gains.
 */
function relevantDimensions(
  variants: Record<string, readonly string[]>,
  evaluate: (ownerState: Record<string, string>) => StyleObject
): string[] {
  const combinations = variantCombinations(variants);
  return Object.keys(variants).filter(dimension => {
    const values = variants[dimension] ?? [];
    return combinations.some(combination => {
      const outputs = values.map(v => fingerprint(evaluate({ ...combination, [dimension]: v })));
      return outputs.some(o => o !== outputs[0]);
    });
  });
}

/**
 * Compiles one component's overrides across its entire variant space.
 *
 * The base rule carries whatever the default combination produces; every other
 * combination emits only what *differs* from it, under a strictly more specific
 * selector in the same layer, so the cascade resolves them in the intended
 * order. Dimensions the style never reads are dropped from the selector
 * entirely.
 *
 * Between those two reductions, a component whose styles ignore `ownerState`
 * emits exactly one rule per part, no matter how large its variant space is.
 */
export function compileOverrides<Theme>(
  manifest: ComponentManifest,
  overrides: Record<string, StyleOverride<Theme, Record<string, string>>>,
  theme: Theme
): Rule[] {
  const rules: Rule[] = [];

  for (const [part, override] of Object.entries(overrides)) {
    if (!manifest.parts.includes(part)) {
      throw new Error(
        `${manifest.scope} has no part "${part}". Known parts: ${manifest.parts.join(", ")}.`
      );
    }

    const base = `[data-scope="${manifest.scope}"][data-part="${part}"]`;
    const evaluate = (ownerState: Record<string, string>) =>
      typeof override === "function" ? override({ theme, ownerState }) : override;

    const baseRules = flattenStyle(evaluate(manifest.defaults), base);
    rules.push(...baseRules);

    const dimensions = relevantDimensions(manifest.variants, evaluate);
    const used = Object.fromEntries(dimensions.map(d => [d, manifest.variants[d] ?? []])) as Record<
      string,
      readonly string[]
    >;

    for (const combination of variantCombinations(used)) {
      const isDefault = Object.entries(combination).every(
        ([name, v]) => manifest.defaults[name] === v
      );
      if (isDefault) continue;

      const selector =
        base +
        Object.entries(combination)
          .map(([name, v]) => `[data-${name}="${v}"]`)
          .join("");

      // Dimensions the style ignores are held at their defaults, so the
      // evaluated result depends only on what ends up in the selector.
      rules.push(
        ...diff(
          baseRules,
          flattenStyle(evaluate({ ...manifest.defaults, ...combination }), selector)
        )
      );
    }
  }

  return rules;
}
