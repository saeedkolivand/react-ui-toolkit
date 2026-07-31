/**
 * The three token layers.
 *
 *   Seed  — the minimal set a user actually chooses. Usually just a brand colour.
 *   Map   — scales derived from the seed by an algorithm: colour ramps, radii, durations.
 *   Alias — semantic names components reference. `--ck-accent-solid`, never `--ck-color-primary-600`.
 *
 * Components read the alias layer only. That indirection is what lets a theme
 * re-point one name and change every component at once, and it is why dark mode
 * is ~45 lines instead of a variant inside all 27 components.
 */

import type { Ramp } from "./ramp";

export interface SeedToken {
  /** Brand colour. Appears verbatim as the solid accent — step 600 of its ramp. */
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  /** Radius of the `md` step, in px. The rest of the scale is derived from it. */
  borderRadius: number;
  /** Duration of the `md` step, in ms. */
  motionUnit: number;
  fontFamily: string;
  /**
   * How much of the accent hue bleeds into the greys. Zero is pure neutral,
   * which reads dirty next to a saturated brand colour.
   */
  neutralChroma: number;
}

export const defaultSeed: SeedToken = {
  colorPrimary: "#0284c7",
  colorSuccess: "#16a34a",
  colorWarning: "#eab308",
  colorError: "#dc2626",
  colorInfo: "#2563eb",
  borderRadius: 6,
  motionUnit: 200,
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  neutralChroma: 0.013,
};

/** Everything an algorithm derives from a seed. */
export interface MapToken {
  primary: Ramp;
  neutral: Ramp;
  green: Ramp;
  red: Ramp;
  yellow: Ramp;
  blue: Ramp;
  radius: Record<"sm" | "base" | "md" | "lg" | "xl" | "2xl", string>;
  duration: Record<"sm" | "md" | "lg", string>;
  fontFamily: string;
}

/**
 * The semantic layer, as CSS custom property names without the `--ck-` prefix.
 * Loosely typed on purpose: this is the public retheming surface, and pinning
 * it to a closed union would mean a component cannot add a token without a
 * breaking change to the type.
 */
export type AliasToken = Record<string, string>;

/**
 * Ratios against the `md` step, so one seed number produces the whole scale.
 * With the default `borderRadius: 6` these land on 2/4/6/8/12/16px — the values
 * the library shipped by hand, which is how they were chosen.
 */
export const RADIUS_RATIO = {
  sm: 1 / 3,
  base: 2 / 3,
  md: 1,
  lg: 4 / 3,
  xl: 2,
  "2xl": 8 / 3,
} as const;

/** Same idea: `motionUnit: 200` gives 120/200/300ms, matching the shipped scale. */
export const DURATION_RATIO = { sm: 0.6, md: 1, lg: 1.5 } as const;
