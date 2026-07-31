/**
 * Ramp derivation: one seed colour in, a ten-step scale out.
 *
 * The seed lands at step 600 rather than in the middle, because 600 is the
 * solid accent every component actually paints with. That means
 * `colorPrimary: "#0284c7"` produces a ramp whose 600 *is* that colour, and a
 * user who picks their brand hex sees their brand hex on the buttons — the
 * single most surprising thing to get wrong.
 */

import { formatOklch, parseToOklch, prefersDarkText, type Oklch } from "./color";

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type RampStep = (typeof RAMP_STEPS)[number];
export type Ramp = Record<RampStep, string>;

/** Index of the step the seed colour is pinned to. */
const SEED_INDEX = RAMP_STEPS.indexOf(600);

/**
 * Perceptual lightness per step.
 *
 * These are not invented. They were measured by converting the ramp this
 * library shipped by hand — a professionally tuned scale — into OKLCH, so the
 * generated output tracks it to within 0.04 L at every step. A linear ramp was
 * tried first and bunches visually at the light end.
 */
const LIGHTNESS = {
  default: [0.977, 0.951, 0.901, 0.828, 0.754, 0.685, 0.588, 0.5, 0.443, 0.391],
  /**
   * Dark mode is not the light ramp reversed. Surfaces sit dark, so the steps
   * that carry weight are the mid tones; both extremes compress, because a
   * mechanically reversed curve puts step 50 at 0.39 — too light for a
   * background — and step 900 near white, which glows.
   */
  dark: [0.238, 0.288, 0.346, 0.412, 0.487, 0.567, 0.648, 0.724, 0.796, 0.864],
} as const;

/**
 * Chroma as a multiple of the seed's own, per step. Measured the same way.
 *
 * Note the peak is at 500, not at 600 where the seed sits: the most saturated
 * step in a good ramp is slightly lighter than its solid colour. Values above
 * 1.0 can push a already-vivid seed outside sRGB, which is deliberate — the
 * browser clips `oklch()` to the display gamut, and clipping beats flattening
 * the ramp on wide-gamut screens.
 */
const CHROMA = {
  default: [0.09, 0.18, 0.4, 0.73, 1.0, 1.06, 1.0, 0.86, 0.72, 0.61],
  dark: [0.16, 0.3, 0.52, 0.78, 1.0, 1.06, 1.0, 0.9, 0.79, 0.67],
} as const;

export type RampAlgorithm = keyof typeof LIGHTNESS;

/**
 * Bends the lightness curve so step 600 lands on the seed's own lightness while
 * the ramp stays monotonic.
 *
 * Substituting the seed's L at 600 and leaving the rest alone does not work:
 * a seed lighter than the curve expects — yellow sits at 0.795 against a curve
 * wanting 0.588 — produces a step 600 lighter than step 500, so the ramp folds
 * back on itself. Instead each half of the curve is rescaled into the range
 * between the seed and that end, which preserves the curve's spacing and keeps
 * every step strictly ordered.
 */
function warpLightness(curve: readonly number[], seedL: number): number[] {
  const pivot = curve[SEED_INDEX];
  const first = curve[0];
  const last = curve[curve.length - 1];
  if (pivot === undefined || first === undefined || last === undefined) {
    throw new Error("lightness curve must have an entry for every ramp step");
  }

  // Push an endpoint further out if the seed has already passed it, so the two
  // halves never collapse to zero range. Written without assuming which
  // direction the curve runs: the default ramp goes light to dark, the dark one
  // goes the other way.
  const extend = (end: number) =>
    end > pivot
      ? Math.min(0.995, Math.max(end, seedL + 0.04))
      : Math.max(0.005, Math.min(end, seedL - 0.04));

  const firstTarget = extend(first);
  const lastTarget = extend(last);

  return curve.map((l, i) => {
    if (i === SEED_INDEX) return seedL;
    // t runs 0 at the pivot to 1 at that half's endpoint, preserving the
    // curve's own spacing; the range it maps into is what changes.
    const end = i < SEED_INDEX ? first : last;
    const target = i < SEED_INDEX ? firstTarget : lastTarget;
    return seedL + ((l - pivot) / (end - pivot)) * (target - seedL);
  });
}

/**
 * Derives a ten-step ramp from one colour, preserving its hue throughout.
 *
 * Chroma is expressed as a multiple of the seed's, so a muted brand colour
 * produces a muted scale and a vivid one produces a vivid scale — rather than
 * every theme converging on the same saturation.
 */
export function deriveRamp(seed: string | Oklch, algorithm: RampAlgorithm = "default"): Ramp {
  const base = typeof seed === "string" ? parseToOklch(seed) : seed;
  const chroma = CHROMA[algorithm];

  // A seed at the very edge of the lightness axis leaves no room for a ramp on
  // that side. Pure white or black is not a usable accent anyway, and the
  // clamp is far below any visible difference.
  const seedL = Math.min(0.98, Math.max(0.02, base.l));
  const lightness = warpLightness(LIGHTNESS[algorithm], seedL);

  // Normalise so the seed's own chroma is reproduced exactly at step 600.
  const pivotChroma = chroma[SEED_INDEX];
  if (pivotChroma === undefined) throw new Error("chroma curve is missing its pivot");
  const chromaUnit = base.c / pivotChroma;

  const ramp = {} as Ramp;
  RAMP_STEPS.forEach((step, i) => {
    const l = lightness[i];
    const cRatio = chroma[i];
    if (l === undefined || cRatio === undefined) {
      throw new Error(`no curve entry for ramp step ${step}`);
    }
    ramp[step] = formatOklch({
      l,
      c: i === SEED_INDEX ? base.c : chromaUnit * cRatio,
      h: base.h,
    });
  });
  return ramp;
}

/**
 * A neutral ramp carries a trace of the accent's hue rather than being pure
 * grey. It is what stops greys looking dirty next to a saturated brand colour,
 * and it is why this takes the accent hue as input instead of a fixed value.
 */
export function deriveNeutralRamp(
  accentHue: number,
  algorithm: RampAlgorithm = "default",
  chroma = 0.013
): Ramp {
  const lightness = LIGHTNESS[algorithm];
  const ramp = {} as Ramp;
  RAMP_STEPS.forEach((step, i) => {
    const l = lightness[i];
    const cRatio = CHROMA[algorithm][i];
    if (l === undefined || cRatio === undefined) {
      throw new Error(`no curve entry for ramp step ${step}`);
    }
    // Slightly more chroma in the mid tones, where a flat trace reads green.
    ramp[step] = formatOklch({ l, c: chroma * cRatio, h: accentHue });
  });
  return ramp;
}

/** Foreground colour to place on a given ramp step. */
export const onColor = (seed: string | Oklch): string =>
  prefersDarkText(typeof seed === "string" ? parseToOklch(seed) : seed)
    ? "oklch(0% 0 0)"
    : "oklch(100% 0 0)";
