import { describe, expect, it } from "vitest";
import { createTheme, themeScript } from "./create-theme";
import { formatOklch, parseToOklch } from "./color";

/** Pull one custom property's value out of the emitted CSS. Throws if absent. */
const varOf = (css: string, name: string): string => {
  const m = new RegExp(`--ck-${name}:\\s*([^;]+);`).exec(css);
  if (!m?.[1]) throw new Error(`--ck-${name} is not in the emitted CSS`);
  return m[1].trim();
};

/** Lightness percentage of an `oklch()` value, as a number. */
const lightnessOf = (value: string): number => {
  const m = /oklch\(([\d.]+)%/.exec(value);
  if (!m?.[1]) throw new Error(`not an oklch() value: ${value}`);
  return parseFloat(m[1]);
};

describe("createTheme", () => {
  it("wraps everything in the overrides layer", () => {
    // Layered CSS beats the component defaults but still loses to a consumer's
    // unlayered rules. Emitting outside a layer would break the second half.
    expect(createTheme().css.startsWith("@layer ck.overrides {")).toBe(true);
  });

  it("targets :root by default", () => {
    expect(createTheme().css).toContain(":root {");
  });

  it("scopes to a data attribute when asked, for nested themes", () => {
    const { css } = createTheme({ scope: "sidebar" });
    expect(css).toContain('[data-ck-theme="sidebar"] {');
    expect(css).not.toContain(":root {");
  });

  it("puts the brand colour on the solid accent step verbatim", () => {
    const { css } = createTheme({ token: { colorPrimary: "#7c3aed" } });
    expect(varOf(css, "color-primary-600")).toBe(formatOklch(parseToOklch("#7c3aed")));
  });

  it("emits all ten steps of every ramp", () => {
    const { css } = createTheme();
    for (const name of ["primary", "neutral", "green", "red", "yellow", "blue"]) {
      for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
        // varOf throws when the property is missing, so reaching the end is
        // the assertion.
        expect(varOf(css, `color-${name}-${step}`)).toMatch(/^oklch\(/);
      }
    }
  });

  it("tints the greys with the brand hue", () => {
    const { css } = createTheme({ token: { colorPrimary: "#dc2626" } });
    const m = /([\d.]+)\)$/.exec(varOf(css, "color-neutral-500"));
    expect(parseFloat(m?.[1] ?? "NaN")).toBeCloseTo(parseToOklch("#dc2626").h, 0);
  });

  it("reproduces the shipped radius scale from the default seed", () => {
    // borderRadius: 6 must give back 2/4/6/8/12/16px — the values the library
    // shipped by hand, which is where the ratios came from.
    const { css } = createTheme();
    expect(varOf(css, "radius-sm")).toBe("2px");
    expect(varOf(css, "radius-base")).toBe("4px");
    expect(varOf(css, "radius-md")).toBe("6px");
    expect(varOf(css, "radius-lg")).toBe("8px");
    expect(varOf(css, "radius-xl")).toBe("12px");
    expect(varOf(css, "radius-2xl")).toBe("16px");
  });

  it("reproduces the shipped duration scale from the default seed", () => {
    const { css } = createTheme();
    expect(varOf(css, "duration-sm")).toBe("120ms");
    expect(varOf(css, "duration-md")).toBe("200ms");
    expect(varOf(css, "duration-lg")).toBe("300ms");
  });

  it("scales the whole radius set from one seed number", () => {
    const { css } = createTheme({ token: { borderRadius: 12 } });
    expect(varOf(css, "radius-md")).toBe("12px");
    expect(varOf(css, "radius-lg")).toBe("16px");
  });

  it("supports a zero radius without emitting negatives", () => {
    const { css } = createTheme({ token: { borderRadius: 0 } });
    for (const k of ["sm", "base", "md", "lg", "xl", "2xl"]) {
      expect(varOf(css, `radius-${k}`)).toBe("0px");
    }
  });

  describe("algorithms", () => {
    it("compact tightens radii and speeds up motion", () => {
      const base = createTheme();
      const compact = createTheme({ algorithm: "compact" });
      expect(parseFloat(varOf(compact.css, "radius-md"))).toBeLessThan(
        parseFloat(varOf(base.css, "radius-md"))
      );
      expect(parseInt(varOf(compact.css, "duration-md"))).toBeLessThan(
        parseInt(varOf(base.css, "duration-md"))
      );
    });

    it("dark inverts the ramp direction", () => {
      const { css } = createTheme({ algorithm: "dark" });
      const l = (step: number) => lightnessOf(varOf(css, `color-primary-${step}`));
      expect(l(50)).toBeLessThan(l(900));
    });

    it("composes a list of algorithms", () => {
      const { css } = createTheme({ algorithm: ["dark", "compact"] });
      const l = (step: number) => lightnessOf(varOf(css, `color-primary-${step}`));
      expect(l(50)).toBeLessThan(l(900)); // dark applied
      expect(varOf(css, "radius-md")).toBe("4px"); // compact applied
    });

    it("accepts a bare algorithm as well as a list", () => {
      expect(createTheme({ algorithm: "compact" }).css).toBe(
        createTheme({ algorithm: ["compact"] }).css
      );
    });
  });

  describe("alias overrides", () => {
    it("passes non-seed keys straight through as semantic tokens", () => {
      const { css } = createTheme({ token: { bg: "#101014", "fg-muted": "#8a8a94" } });
      expect(varOf(css, "bg")).toBe("#101014");
      expect(varOf(css, "fg-muted")).toBe("#8a8a94");
    });

    it("lets an alias override beat a derived value", () => {
      // Escape hatch: the derived ramp is a default, not a decision.
      const { css } = createTheme({
        token: { colorPrimary: "#7c3aed", "color-primary-600": "#ff0000" },
      });
      expect(varOf(css, "color-primary-600")).toBe("#ff0000");
    });

    it("does not leak seed keys into the CSS", () => {
      const { css } = createTheme({ token: { colorPrimary: "#7c3aed" } });
      expect(css).not.toContain("--ck-colorPrimary");
      expect(css).not.toContain("--ck-borderRadius");
    });
  });

  describe("bad input is refused, not emitted", () => {
    it("treats an undefined seed value as unspecified", () => {
      // The natural caller shape: `colorPrimary: userConfig.brandColour` where
      // the field is optional. Passing it through overwrote the default with
      // undefined and threw inside the colour parser.
      expect(createTheme({ token: { colorPrimary: undefined } }).seed.colorPrimary).toBe("#0284c7");
    });

    it("does not emit an undefined alias value", () => {
      // `--ck-bg: undefined` is a *valid* custom property declaration, so it
      // wins over the derived value and then breaks every var() reading it.
      const { css } = createTheme({ token: { "color-primary-600": undefined } });
      expect(css).not.toContain("undefined");
      expect(varOf(css, "color-primary-600")).toMatch(/^oklch\(/);
    });

    it("rejects a hex with invalid digits rather than producing NaN", () => {
      // Previously yielded oklch(NaN% NaN NaN) for all ten steps; the browser
      // drops those, silently deleting the primary ramp and the neutral ramp
      // derived from its hue.
      expect(() => createTheme({ token: { colorPrimary: "#gggggg" } })).toThrow(
        /Cannot parse colour/
      );
    });

    it("rejects non-numeric rgb() channels", () => {
      expect(() => createTheme({ token: { colorPrimary: "rgb(a, b, c)" } })).toThrow(
        /Cannot parse colour/
      );
    });

    it("never emits NaN for any accepted colour", () => {
      const { css } = createTheme({ token: { colorPrimary: "#7c3aed" } });
      expect(css).not.toContain("NaN");
    });

    it("escapes a scope that would close the attribute selector", () => {
      const { css } = createTheme({ scope: 'x"] { color: red } [data-y="' });
      expect(css).toContain('[data-ck-theme="x\\"] { color: red } [data-y=\\""]');
      // Counting braces cannot decide this — the payload legitimately contains
      // one inside the quoted selector. What matters is that nothing injected
      // became a *declaration*: every indented line is a --ck- custom property.
      const declarations = css.split("\n").filter(line => line.startsWith("  "));
      expect(declarations.length).toBeGreaterThan(0);
      expect(declarations.every(line => line.trimStart().startsWith("--ck-"))).toBe(true);
    });

    it("rejects a token value that would end its own declaration", () => {
      expect(() => createTheme({ token: { bg: "#fff; } :root { display: none" } })).toThrow(
        /unsafe value/
      );
    });
  });

  it("returns the resolved seed and map alongside the CSS", () => {
    const theme = createTheme({ token: { colorPrimary: "#7c3aed" } });
    expect(theme.seed.colorPrimary).toBe("#7c3aed");
    expect(theme.seed.borderRadius).toBe(6); // default kept
    expect(theme.map.primary[600]).toBe(formatOklch(parseToOklch("#7c3aed")));
  });

  it("is deterministic", () => {
    // Golden-test precondition: same config in, byte-identical CSS out.
    const config = { token: { colorPrimary: "#7c3aed" }, algorithm: "compact" as const };
    expect(createTheme(config).css).toBe(createTheme(config).css);
  });

  it("emits stable, readable CSS", () => {
    expect(createTheme({ token: { colorPrimary: "#7c3aed" } }).css).toMatchSnapshot();
  });
});

describe("themeScript", () => {
  it("resolves a stored preference to a concrete theme", () => {
    const run = (stored: string | null, prefersDark: boolean) => {
      const root = { dataset: {} as Record<string, string> };
      new Function("localStorage", "matchMedia", "document", themeScript())(
        { getItem: () => stored },
        () => ({ matches: prefersDark }),
        { documentElement: root }
      );
      return root.dataset.theme;
    };

    expect(run("dark", false)).toBe("dark");
    expect(run("light", true)).toBe("light");
    expect(run("system", true)).toBe("dark");
    expect(run("system", false)).toBe("light");
    expect(run(null, true)).toBe("dark"); // no preference stored → follow the OS
  });

  it("never throws, so a blocked localStorage cannot break the page", () => {
    const root = { dataset: {} as Record<string, string> };
    expect(() =>
      new Function("localStorage", "matchMedia", "document", themeScript())(
        {
          getItem() {
            throw new Error("blocked in private mode");
          },
        },
        () => ({ matches: false }),
        { documentElement: root }
      )
    ).not.toThrow();
  });

  it("honours a custom storage key", () => {
    expect(themeScript("my-key")).toContain('"my-key"');
  });

  it("cannot break out of the script tag it is inlined into", () => {
    // JSON.stringify makes a valid JS string but leaves `</script>` intact,
    // which would close the tag early and turn the remainder into markup.
    expect(themeScript("a</script><img src=x onerror=alert(1)>")).not.toContain("</script>");
  });
});
