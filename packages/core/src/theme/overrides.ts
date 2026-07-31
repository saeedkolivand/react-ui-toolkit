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

import { escapeAttributeValue } from "./css";
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

/**
 * One emitted CSS rule. Named `CssRule` rather than `Rule` because the form
 * engine's validation rule has the stronger claim on the bare name, and two
 * `Rule`s on one barrel is the ambiguous-star-export trap.
 */
export interface CssRule {
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
): CssRule[] {
  const declarations: string[] = [];
  const nested: CssRule[] = [];

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

const property = (declaration: string) => declaration.slice(0, declaration.indexOf(":"));

/**
 * What a combination adds to, or removes from, the base rule.
 *
 * Base rules are projected into the combination's own selector space rather
 * than the combination's being stripped back with a regex. Stripping cannot
 * tell an attribute this compiler added from one the author wrote in a nested
 * key — `&[data-state="open"]` is indistinguishable from `[data-size="large"]`
 * to a pattern — so it removed both, the lookup missed, and every unchanged
 * declaration was re-emitted for the whole cross product. That silently
 * cancels the reduction this function exists for.
 */
function diff(
  base: CssRule[],
  next: CssRule[],
  toVariant: (selector: string) => string
): CssRule[] {
  const key = (conditions: string[], selector: string) => `${conditions.join("|")}||${selector}`;
  const projected = new Map(base.map(r => [key(r.conditions, toVariant(r.selector)), r]));

  const out: CssRule[] = [];
  const matched = new Set<string>();

  for (const rule of next) {
    const k = key(rule.conditions, rule.selector);
    matched.add(k);
    const counterpart = projected.get(k);
    const inherited = new Set(counterpart?.declarations ?? []);
    const present = new Set(rule.declarations.map(property));

    const declarations = [
      ...rule.declarations.filter(d => !inherited.has(d)),
      // A property the base sets and this combination does not must be undone,
      // or `size === "large" ? {} : { padding: 8 }` still gets 8px. `revert-layer`
      // falls back to the component's own stylesheet, which is what "the style
      // function said nothing here" should mean.
      ...(counterpart?.declarations ?? [])
        .map(property)
        .filter(p => !present.has(p))
        .map(p => `${p}: revert-layer`),
    ];

    if (declarations.length) out.push({ ...rule, declarations });
  }

  // A nested block that vanishes entirely for this combination still needs its
  // declarations undone, and has no rule in `next` to hang them on.
  for (const [k, rule] of projected) {
    if (matched.has(k)) continue;
    out.push({
      selector: toVariant(rule.selector),
      conditions: rule.conditions,
      declarations: rule.declarations.map(d => `${property(d)}: revert-layer`),
    });
  }

  return out;
}

export function serializeRules(rules: CssRule[]): string {
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
): CssRule[] {
  const rules: CssRule[] = [];

  for (const [part, override] of Object.entries(overrides)) {
    if (!manifest.parts.includes(part)) {
      throw new Error(
        `${manifest.scope} has no part "${part}". Known parts: ${manifest.parts.join(", ")}.`
      );
    }

    // A variant compiles to `[data-name="value"]`, and every boolean in this
    // library is a *presence* attribute — `dataAttr()` renders `data-loading=""`
    // or nothing at all. So `loading: ["true", "false"]` would compile to
    // `[data-loading="true"]`, which matches nothing any adapter renders, and
    // the override would silently do nothing. Nested keys are the answer, the
    // same as for interactive states.
    for (const [name, values] of Object.entries(manifest.variants)) {
      const boolean = values.find(v => v === "true" || v === "false");
      if (boolean !== undefined) {
        throw new Error(
          `Variant "${name}" declares "${boolean}", but booleans are presence attributes here — ` +
            `data-${name}="" or absent, never "true"/"false". Target it with a nested key ` +
            `instead: { '&[data-${name}]': { … } }.`
        );
      }
    }

    const base = `[data-scope="${escapeAttributeValue(manifest.scope)}"][data-part="${part}"]`;
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
          .map(([name, v]) => `[data-${name}="${escapeAttributeValue(v)}"]`)
          .join("");

      // Base selectors carry `base` verbatim, including inside nested keys, so
      // swapping it for the variant selector projects the whole rule set —
      // pseudo-classes, descendants and at-rules included.
      const toVariant = (s: string) => s.split(base).join(selector);

      // Dimensions the style ignores are held at their defaults, so the
      // evaluated result depends only on what ends up in the selector.
      rules.push(
        ...diff(
          baseRules,
          flattenStyle(evaluate({ ...manifest.defaults, ...combination }), selector),
          toVariant
        )
      );
    }
  }

  return rules;
}
