/**
 * `createTheme()` — a theme configuration in, a plain CSS string out.
 *
 * The whole point is that nothing here runs at render time. The algorithm runs
 * once, produces text, and that text goes in a `<style>` tag or into `<head>`
 * during SSR. There is no style engine, no class hashing, no per-framework
 * server collector, and no runtime cost per component instance.
 *
 * Output goes into `@layer ck.overrides`, the last of the library's layers, so
 * a theme beats the component defaults — while a consumer's own *unlayered*
 * CSS still beats the theme. That ordering is the whole override story.
 */

import { parseToOklch } from "./color";
import { assertSafeValue, escapeAttributeValue } from "./css";
import { deriveNeutralRamp, deriveRamp, RAMP_STEPS, type Ramp, type RampAlgorithm } from "./ramp";
import { manifests, type ComponentManifest } from "./manifest";
import { compileOverrides, serializeRules, type StyleOverride } from "./overrides";
import {
  defaultSeed,
  DURATION_RATIO,
  RADIUS_RATIO,
  type AliasToken,
  type MapToken,
  type SeedToken,
} from "./tokens";

export type ThemeAlgorithm = "default" | "dark" | "compact";

export interface ThemeConfig {
  /**
   * Overrides for any seed value, plus any alias token by name. Everything
   * unspecified keeps its default.
   *
   * The index signature admits numbers as well as strings because seed values
   * like `borderRadius` are numeric — an `AliasToken`-only signature would
   * reject them.
   */
  token?: Partial<SeedToken> & { [alias: string]: string | number | undefined };
  /** One algorithm or a composed list, applied in order. */
  algorithm?: ThemeAlgorithm | ThemeAlgorithm[];
  /**
   * Per-component customisation: token overrides scoped to one component, and
   * arbitrary CSS per part.
   *
   * ```ts
   * components: {
   *   Button: {
   *     token: { "accent-solid": "#059669" },
   *     styleOverrides: {
   *       root: ({ theme, ownerState }) => ({
   *         padding: ownerState.size === "large" ? 16 : 8,
   *       }),
   *     },
   *   },
   * }
   * ```
   */
  components?: Record<string, ComponentConfig>;
  /**
   * Variant manifests to compile `styleOverrides` against. Defaults to the
   * library's own registry; pass extras to theme components built on the same
   * token system.
   */
  manifests?: Record<string, ComponentManifest>;
  /**
   * Emit under `[data-ck-theme="<scope>"]` instead of `:root`, so a theme can
   * apply to part of a page. Nested themes use this.
   */
  scope?: string;
}

export interface ComponentConfig {
  /** Alias tokens re-pointed for this component only, scoped by `data-scope`. */
  token?: Record<string, string | number>;
  /** Arbitrary CSS per part, compiled across the component's variant space. */
  styleOverrides?: Record<string, StyleOverride<CompiledTheme, Record<string, string>>>;
}

export interface CompiledTheme {
  seed: SeedToken;
  map: MapToken;
  /** Ready to put in a `<style>` tag. */
  css: string;
}

const SEED_KEYS = new Set(Object.keys(defaultSeed));

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/** Derives every scale from the seed. */
function buildMap(seed: SeedToken, ramp: RampAlgorithm, compact: boolean): MapToken {
  const radiusBase = compact ? seed.borderRadius * (2 / 3) : seed.borderRadius;
  const motionBase = compact ? seed.motionUnit * 0.75 : seed.motionUnit;

  return {
    primary: deriveRamp(seed.colorPrimary, ramp),
    // Greys take the brand hue rather than being neutral grey.
    neutral: deriveNeutralRamp(parseToOklch(seed.colorPrimary).h, ramp, seed.neutralChroma),
    green: deriveRamp(seed.colorSuccess, ramp),
    red: deriveRamp(seed.colorError, ramp),
    yellow: deriveRamp(seed.colorWarning, ramp),
    blue: deriveRamp(seed.colorInfo, ramp),
    radius: Object.fromEntries(
      Object.entries(RADIUS_RATIO).map(([k, r]) => [k, px(radiusBase * r)])
    ) as MapToken["radius"],
    duration: Object.fromEntries(
      Object.entries(DURATION_RATIO).map(([k, r]) => [k, `${Math.round(motionBase * r)}ms`])
    ) as MapToken["duration"],
    fontFamily: seed.fontFamily,
  };
}

/** `{ "a": "1", "b": "2" }` → `--ck-a: 1;\n  --ck-b: 2;` */
const declarations = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([name, value]) => `  --ck-${name}: ${value};`)
    .join("\n");

function rampVars(name: string, ramp: Ramp): Record<string, string> {
  const out: Record<string, string> = {};
  for (const step of RAMP_STEPS) out[`color-${name}-${step}`] = ramp[step];
  return out;
}

export function createTheme(config: ThemeConfig = {}): CompiledTheme {
  const algorithms = Array.isArray(config.algorithm)
    ? config.algorithm
    : config.algorithm
      ? [config.algorithm]
      : [];

  const rampAlgorithm: RampAlgorithm = algorithms.includes("dark") ? "dark" : "default";
  const compact = algorithms.includes("compact");

  // Anything in `token` that is not a seed key is an alias override — the
  // escape hatch for re-pointing a semantic name directly, e.g. `bg`.
  const seedOverrides: Partial<SeedToken> = {};
  const aliasOverrides: AliasToken = {};
  for (const [key, value] of Object.entries(config.token ?? {})) {
    // `undefined` means "not specified", which is what an optional field on a
    // caller's own config object produces. Letting it through would overwrite a
    // seed default with undefined (and throw inside the colour parser), or emit
    // a literal `--ck-bg: undefined` — a *valid* custom property declaration
    // that beats the derived value and then fails at every var() that reads it.
    if (value === undefined) continue;
    if (SEED_KEYS.has(key)) (seedOverrides as Record<string, unknown>)[key] = value;
    else aliasOverrides[key] = assertSafeValue(key, String(value));
  }

  const seed: SeedToken = { ...defaultSeed, ...seedOverrides };
  const map = buildMap(seed, rampAlgorithm, compact);

  const vars: Record<string, string> = {
    ...rampVars("primary", map.primary),
    ...rampVars("neutral", map.neutral),
    ...rampVars("green", map.green),
    ...rampVars("red", map.red),
    ...rampVars("yellow", map.yellow),
    ...rampVars("blue", map.blue),
    ...Object.fromEntries(Object.entries(map.radius).map(([k, v]) => [`radius-${k}`, v])),
    ...Object.fromEntries(Object.entries(map.duration).map(([k, v]) => [`duration-${k}`, v])),
    "font-sans": map.fontFamily,
    // Alias overrides land last so they beat anything derived.
    ...aliasOverrides,
  };

  const selector = config.scope
    ? `[data-ck-theme="${escapeAttributeValue(config.scope)}"]`
    : ":root";
  const blocks = [`${selector} {\n${declarations(vars)}\n}`];

  const theme: CompiledTheme = { seed, map, css: "" };
  const registry = { ...manifests, ...config.manifests };

  for (const [name, component] of Object.entries(config.components ?? {})) {
    const manifest = registry[name];
    if (!manifest) {
      const known = Object.keys(registry);
      throw new Error(
        `No variant manifest for "${name}".` +
          (known.length ? ` Known components: ${known.join(", ")}.` : "") +
          " Pass one via `manifests` to theme a component the library does not ship."
      );
    }

    // Component tokens are just custom properties scoped by data-scope, so they
    // cost nothing beyond one rule and still cascade into every part.
    if (component.token && Object.keys(component.token).length > 0) {
      const scoped = Object.fromEntries(
        Object.entries(component.token).map(([k, v]) => [k, String(v)])
      );
      blocks.push(`[data-scope="${manifest.scope}"] {\n${declarations(scoped)}\n}`);
    }

    if (component.styleOverrides) {
      const rules = serializeRules(compileOverrides(manifest, component.styleOverrides, theme));
      if (rules) blocks.push(rules);
    }
  }

  theme.css = `@layer ck.overrides {\n${blocks.join("\n")}\n}\n`;
  return theme;
}

/**
 * A `<script>` body for `<head>` that applies the stored theme preference
 * before first paint.
 *
 * Returned as a string rather than run, so a server component can render it
 * with no client JavaScript at all. Without it, a dark-mode user sees a light
 * flash on every navigation.
 */
export function themeScript(storageKey = "ck-theme"): string {
  // JSON.stringify escapes quotes and backslashes, which makes this a valid JS
  // string literal -- but the result is inlined into a <script> element, and
  // `</script>` inside the key would close the tag early and turn the rest into
  // markup. Escaping the slash is the standard fix and costs nothing.
  const key = JSON.stringify(storageKey).replace(/\//g, "\\/");
  return (
    `(function(){try{var p=localStorage.getItem(${key})||"system";` +
    `var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);` +
    `document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`
  );
}
