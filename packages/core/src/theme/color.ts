/**
 * Colour maths for ramp derivation.
 *
 * Only one direction is implemented: sRGB in, OKLCH out. Ramps are emitted as
 * `oklch()` directly, so there is never a reason to convert back — which also
 * hands gamut clipping to the browser instead of reimplementing it here.
 *
 * OKLCH rather than HSL because HSL's lightness is not perceptual: an HSL ramp
 * through yellow and one through blue at the same L look nothing alike, so a
 * user's brand colour would produce a scale that reads wrong at some hues and
 * fine at others. In OKLCH, equal L means equal apparent lightness.
 *
 * Conversion constants are Björn Ottosson's published OKLab matrices.
 */

export interface Oklch {
  /** Perceptual lightness, 0–1. */
  l: number;
  /** Chroma, 0–~0.4 in practice. */
  c: number;
  /** Hue angle in degrees, 0–360. */
  h: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** sRGB channel (0–1) to linear light. */
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/**
 * Accepts `#rgb`, `#rrggbb`, `#rrggbbaa` and `rgb()` / `rgba()`. Alpha is
 * parsed and discarded — a token ramp is opaque, and a translucent seed would
 * silently produce a ramp that ignores it.
 */
export function parseColor(input: string): { r: number; g: number; b: number } {
  const value = input.trim().toLowerCase();

  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map(ch => ch + ch)
        .join("");
    }
    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error(`Cannot parse colour: ${input}`);
    }
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
    };
  }

  const rgb = /^rgba?\(([^)]+)\)$/.exec(value);
  if (rgb?.[1]) {
    const [r, g, b] = rgb[1].split(/[\s,/]+/).filter(Boolean);
    if (!r || !g || !b) throw new Error(`Cannot parse colour: ${input}`);
    const channel = (p: string) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255);
    return { r: channel(r), g: channel(g), b: channel(b) };
  }

  throw new Error(`Cannot parse colour: ${input}. Use hex or rgb().`);
}

export function rgbToOklch({ r, g, b }: { r: number; g: number; b: number }): Oklch {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.hypot(okA, okB);
  // Grey has no meaningful hue; atan2(0, 0) is 0, which would silently make
  // every neutral ramp red-hued the moment chroma is added back.
  const h = c < 1e-6 ? 0 : ((Math.atan2(okB, okA) * 180) / Math.PI + 360) % 360;

  return { l: clamp01(okL), c, h };
}

export const parseToOklch = (input: string): Oklch => rgbToOklch(parseColor(input));

const round = (n: number, places: number) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};

/** CSS `oklch()`. Values are rounded because these end up in a shipped stylesheet. */
export const formatOklch = ({ l, c, h }: Oklch): string =>
  `oklch(${round(l * 100, 2)}% ${round(c, 4)} ${round(h, 2)})`;

/**
 * Whether text on this background should be dark.
 *
 * A perceptual lightness threshold, not a WCAG contrast computation: OKLCH L
 * already is apparent lightness, so the useful question is just "is this
 * bright". 0.62 is where white text stops being comfortable on saturated mid
 * tones in practice.
 */
export const prefersDarkText = ({ l }: Oklch): boolean => l > 0.62;
