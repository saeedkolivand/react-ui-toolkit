import { describe, expect, it } from "vitest";
import { formatOklch, parseColor, parseToOklch, prefersDarkText, rgbToOklch } from "./color";
import { deriveNeutralRamp, deriveRamp, RAMP_STEPS } from "./ramp";

/** Pull the three numbers back out of an `oklch()` string. */
const read = (css: string) => {
  const m = /oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)/.exec(css);
  if (!m?.[1] || !m[2] || !m[3]) throw new Error(`not an oklch() string: ${css}`);
  return { l: parseFloat(m[1]) / 100, c: parseFloat(m[2]), h: parseFloat(m[3]) };
};

/**
 * Asserts a ramp never reverses direction. Written as a helper with explicit
 * bounds so it reads the same in every case that uses it.
 */
const expectMonotonic = (values: number[], label: (i: number) => string) => {
  const [first] = values;
  const last = values[values.length - 1];
  if (first === undefined || last === undefined) throw new Error("ramp is empty");
  const descending = first > last;
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    const cur = values[i];
    if (prev === undefined || cur === undefined) throw new Error("ramp is short");
    expect(descending ? cur < prev : cur > prev, label(i)).toBe(true);
  }
};

describe("parseColor", () => {
  it("reads long hex", () => {
    expect(parseColor("#0284c7")).toEqual({ r: 2 / 255, g: 132 / 255, b: 199 / 255 });
  });

  it("expands short hex", () => {
    expect(parseColor("#08c")).toEqual(parseColor("#0088cc"));
  });

  it("ignores the alpha channel rather than blending it", () => {
    expect(parseColor("#0284c780")).toEqual(parseColor("#0284c7"));
  });

  it("is case and whitespace insensitive", () => {
    expect(parseColor("  #0284C7 ")).toEqual(parseColor("#0284c7"));
  });

  it("reads rgb() and rgba()", () => {
    expect(parseColor("rgb(2, 132, 199)")).toEqual(parseColor("#0284c7"));
    expect(parseColor("rgba(2 132 199 / 0.5)")).toEqual(parseColor("#0284c7"));
  });

  it("refuses what it cannot parse instead of guessing", () => {
    expect(() => parseColor("rebeccapurple")).toThrow(/Cannot parse colour/);
    expect(() => parseColor("#12345")).toThrow(/Cannot parse colour/);
  });
});

describe("rgbToOklch", () => {
  it("puts white and black at the ends of the lightness axis", () => {
    expect(rgbToOklch({ r: 1, g: 1, b: 1 }).l).toBeCloseTo(1, 2);
    expect(rgbToOklch({ r: 0, g: 0, b: 0 }).l).toBeCloseTo(0, 2);
  });

  it("reports no chroma for greys", () => {
    expect(rgbToOklch({ r: 0.5, g: 0.5, b: 0.5 }).c).toBeLessThan(0.001);
  });

  it("gives grey hue 0 rather than an artefact of atan2", () => {
    // Without the guard this is whatever atan2(~0, ~0) returns, and a neutral
    // ramp built on it comes out subtly red.
    expect(rgbToOklch({ r: 0.5, g: 0.5, b: 0.5 }).h).toBe(0);
  });

  it("orders primaries by hue as expected", () => {
    const red = rgbToOklch({ r: 1, g: 0, b: 0 }).h;
    const green = rgbToOklch({ r: 0, g: 1, b: 0 }).h;
    const blue = rgbToOklch({ r: 0, g: 0, b: 1 }).h;
    expect(red).toBeGreaterThan(0);
    expect(red).toBeLessThan(60);
    expect(green).toBeGreaterThan(130);
    expect(green).toBeLessThan(160);
    expect(blue).toBeGreaterThan(240);
    expect(blue).toBeLessThan(290);
  });

  it("ranks perceptual lightness the way eyes do", () => {
    // The point of OKLCH over HSL: yellow reads far lighter than blue, even
    // though HSL calls both 50% light.
    const yellow = rgbToOklch({ r: 1, g: 1, b: 0 }).l;
    const blue = rgbToOklch({ r: 0, g: 0, b: 1 }).l;
    expect(yellow).toBeGreaterThan(blue + 0.3);
  });
});

describe("formatOklch", () => {
  it("emits a percentage lightness and rounds for a shipped stylesheet", () => {
    expect(formatOklch({ l: 0.5123456, c: 0.123456, h: 240.123456 })).toBe(
      "oklch(51.23% 0.1235 240.12)"
    );
  });
});

describe("prefersDarkText", () => {
  it("puts dark text on light backgrounds and light text on dark", () => {
    expect(prefersDarkText(parseToOklch("#ffffff"))).toBe(true);
    expect(prefersDarkText(parseToOklch("#000000"))).toBe(false);
    expect(prefersDarkText(parseToOklch("#0284c7"))).toBe(false);
    expect(prefersDarkText(parseToOklch("#fde047"))).toBe(true);
  });
});

describe("deriveRamp", () => {
  const seed = "#0284c7";
  const ramp = deriveRamp(seed);

  it("reproduces the seed exactly at step 600", () => {
    // The load-bearing property: a user's brand hex is what appears on the
    // buttons, not something near it.
    expect(ramp[600]).toBe(formatOklch(parseToOklch(seed)));
  });

  it("produces every step", () => {
    expect(Object.keys(ramp).map(Number)).toEqual([...RAMP_STEPS]);
  });

  it("gets darker at every step, without exception", () => {
    expectMonotonic(
      RAMP_STEPS.map(s => read(ramp[s]).l),
      i => `step ${RAMP_STEPS[i]} vs ${RAMP_STEPS[i - 1]}`
    );
  });

  it("stays monotonic for seeds far off the curve, in both algorithms", () => {
    // The bug this exists for: pinning the seed's own lightness at step 600 and
    // leaving the rest of the curve alone folds the ramp back on itself for any
    // seed whose lightness differs from what the curve expects there. Yellow
    // (#eab308, L 0.795 against a curve wanting 0.588) produced a step 600
    // *lighter* than step 500. Testing only #0284c7 missed it entirely,
    // because that colour happens to sit almost exactly on the curve.
    const seeds = ["#eab308", "#fde047", "#0c0a09", "#16a34a", "#dc2626", "#2563eb", "#ffffff"];
    for (const seedColor of seeds) {
      for (const algorithm of ["default", "dark"] as const) {
        expectMonotonic(
          RAMP_STEPS.map(step => read(deriveRamp(seedColor, algorithm)[step]).l),
          i => `${seedColor} ${algorithm}: step ${RAMP_STEPS[i]} vs ${RAMP_STEPS[i - 1]}`
        );
      }
    }
  });

  it("holds one hue throughout", () => {
    const h = read(ramp[600]).h;
    for (const step of RAMP_STEPS) expect(read(ramp[step]).h).toBeCloseTo(h, 1);
  });

  it("peaks in chroma in the middle and falls away at both ends", () => {
    const cs = RAMP_STEPS.map(s => read(ramp[s]).c);
    const peak = Math.max(...cs);
    // Slightly lighter than the solid step, matching how tuned ramps behave —
    // not at 600 where the seed sits.
    expect(RAMP_STEPS[cs.indexOf(peak)]).toBe(500);
    expect(cs[0]).toBeLessThan(peak);
    expect(cs[cs.length - 1]).toBeLessThan(peak);
  });

  it("tracks the hand-tuned ramp it was measured from", () => {
    // The regression guard on the curves: if someone retunes LIGHTNESS or
    // CHROMA, this says whether the result still resembles a good ramp.
    const handPicked: Record<number, string> = {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    };
    for (const step of RAMP_STEPS) {
      const reference = handPicked[step];
      if (!reference) throw new Error(`no reference colour for step ${step}`);
      const expected = parseToOklch(reference);
      const actual = read(ramp[step]);
      expect(actual.l, `step ${step} lightness`).toBeCloseTo(expected.l, 1);
      expect(Math.abs(actual.c - expected.c), `step ${step} chroma`).toBeLessThan(0.025);
    }
  });

  it("scales saturation to the seed rather than normalising it", () => {
    // A muted brand colour must not come back vivid.
    const vivid = deriveRamp("#0284c7");
    const muted = deriveRamp("#5b7c8d");
    expect(read(muted[400]).c).toBeLessThan(read(vivid[400]).c);
  });

  it("keeps dark-mode ramps light-to-dark inverted relative to default", () => {
    const dark = deriveRamp(seed, "dark");
    expect(read(dark[50]).l).toBeLessThan(read(dark[900]).l);
  });

  it("never emits a lightness outside 0-100%", () => {
    for (const seedColor of ["#ffffff", "#000000", "#ff0000", "#0284c7"]) {
      for (const algorithm of ["default", "dark"] as const) {
        for (const step of RAMP_STEPS) {
          const { l } = read(deriveRamp(seedColor, algorithm)[step]);
          expect(l, `${seedColor} ${algorithm} ${step}`).toBeGreaterThanOrEqual(0);
          expect(l).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("survives a fully desaturated seed", () => {
    const grey = deriveRamp("#808080");
    for (const step of RAMP_STEPS) expect(read(grey[step]).c).toBeLessThan(0.01);
  });
});

describe("deriveNeutralRamp", () => {
  it("carries the accent hue so greys do not look dirty beside it", () => {
    const hue = parseToOklch("#0284c7").h;
    const neutral = deriveNeutralRamp(hue);
    expect(read(neutral[500]).h).toBeCloseTo(hue, 1);
  });

  it("stays near-grey", () => {
    const neutral = deriveNeutralRamp(240);
    for (const step of RAMP_STEPS) expect(read(neutral[step]).c).toBeLessThan(0.02);
  });

  it("gets darker at every step", () => {
    expectMonotonic(
      RAMP_STEPS.map(s => read(deriveNeutralRamp(240)[s]).l),
      i => `step ${RAMP_STEPS[i]} vs ${RAMP_STEPS[i - 1]}`
    );
  });
});
