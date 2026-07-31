import { describe, expect, it } from "vitest";
import { compileOverrides, flattenStyle, serializeRules } from "./overrides";
import { variantCombinations, type ComponentManifest } from "./manifest";

const BUTTON: ComponentManifest = {
  scope: "button",
  parts: ["root", "icon"],
  variants: {
    type: ["default", "primary", "text"],
    size: ["small", "middle", "large"],
  },
  defaults: { type: "default", size: "middle" },
};

const rulesFor = (css: string, needle: string) =>
  css.split("\n").filter(line => line.includes(needle));

describe("variantCombinations", () => {
  it("produces the full cross product", () => {
    const combos = variantCombinations({ a: ["1", "2"], b: ["x", "y", "z"] });
    expect(combos).toHaveLength(6);
    expect(combos).toContainEqual({ a: "2", b: "y" });
  });

  it("returns one empty combination when there are no variants", () => {
    expect(variantCombinations({})).toEqual([{}]);
  });
});

describe("flattenStyle", () => {
  it("kebab-cases properties and adds px to lengths", () => {
    const [rule] = flattenStyle({ paddingInline: 16, letterSpacing: "0.02em" }, ".x");
    expect(rule?.declarations).toEqual(["padding-inline: 16px", "letter-spacing: 0.02em"]);
  });

  it("leaves unitless properties alone", () => {
    const [rule] = flattenStyle({ opacity: 0.5, fontWeight: 600, zIndex: 10 }, ".x");
    expect(rule?.declarations).toEqual(["opacity: 0.5", "font-weight: 600", "z-index: 10"]);
  });

  it("does not put px on zero", () => {
    const [rule] = flattenStyle({ margin: 0 }, ".x");
    expect(rule?.declarations).toEqual(["margin: 0"]);
  });

  it("leaves custom property names uncased", () => {
    // `--ck-Foo` and `--ck-foo` are different properties; folding the case
    // would silently target neither.
    const [rule] = flattenStyle({ "--ck-buttonBg": "red" }, ".x");
    expect(rule?.declarations).toEqual(["--ck-buttonBg: red"]);
  });

  it("substitutes & for the parent selector", () => {
    const rules = flattenStyle({ color: "red", "&:hover": { color: "blue" } }, ".x");
    expect(rules.map(r => r.selector)).toEqual([".x", ".x:hover"]);
  });

  it("treats a nested key without & as a descendant", () => {
    const rules = flattenStyle({ '[data-part="icon"]': { opacity: 0.5 } }, ".x");
    expect(rules[0]?.selector).toBe('.x [data-part="icon"]');
  });

  it("wraps at-rules around the rule rather than inside it", () => {
    const rules = flattenStyle({ "@media (min-width: 40em)": { color: "red" } }, ".x");
    expect(rules[0]).toMatchObject({
      selector: ".x",
      conditions: ["@media (min-width: 40em)"],
    });
    expect(serializeRules(rules)).toBe("@media (min-width: 40em) { .x { color: red } }");
  });

  it("skips undefined so a conditional spread can collapse to nothing", () => {
    const [rule] = flattenStyle({ color: "red", background: undefined }, ".x");
    expect(rule?.declarations).toEqual(["color: red"]);
  });

  it("emits no rule for an empty style object", () => {
    expect(flattenStyle({}, ".x")).toEqual([]);
  });
});

describe("compileOverrides", () => {
  const theme = { shadows: ["none", "0 1px 2px #000"] };

  it("emits one rule per part when nothing depends on ownerState", () => {
    const rules = compileOverrides(
      BUTTON,
      { root: { letterSpacing: "0.02em" }, icon: { opacity: 0.8 } },
      theme
    );
    // The property that keeps output small: nine variant combinations, but
    // nothing varies, so nothing beyond the base is emitted.
    expect(rules).toHaveLength(2);
    expect(rules.map(r => r.selector)).toEqual([
      '[data-scope="button"][data-part="root"]',
      '[data-scope="button"][data-part="icon"]',
    ]);
  });

  it("emits only what differs from the default combination", () => {
    const css = serializeRules(
      compileOverrides(
        BUTTON,
        {
          root: ({ ownerState }) => ({
            padding: ownerState.size === "large" ? 16 : 8,
            letterSpacing: "0.02em",
          }),
        },
        theme
      )
    );

    // Base carries both declarations.
    expect(rulesFor(css, '[data-part="root"] {')[0]).toContain("padding: 8px");
    expect(rulesFor(css, '[data-part="root"] {')[0]).toContain("letter-spacing: 0.02em");

    // The large rules carry only the padding — letter-spacing is unchanged, so
    // repeating it would be noise in every shipped stylesheet.
    const large = rulesFor(css, '[data-size="large"]');
    expect(large).not.toHaveLength(0);
    for (const rule of large) {
      expect(rule).toContain("padding: 16px");
      expect(rule).not.toContain("letter-spacing");
    }
  });

  it("gives every varying combination a selector more specific than the base", () => {
    const rules = compileOverrides(
      BUTTON,
      { root: ({ ownerState }) => ({ padding: ownerState.size === "large" ? 16 : 8 }) },
      theme
    );
    const base = rules.find(r => r.selector.endsWith('[data-part="root"]'));
    const variant = rules.find(r => r.selector.includes('[data-size="large"]'));
    expect(base).toBeDefined();
    expect(variant?.selector.startsWith(base!.selector)).toBe(true);
  });

  it("passes the theme through to the style function", () => {
    const rules = compileOverrides(
      BUTTON,
      { root: ({ theme: t }) => ({ boxShadow: t.shadows[1] }) },
      theme
    );
    expect(rules[0]?.declarations).toEqual(["box-shadow: 0 1px 2px #000"]);
  });

  it("branches on more than one dimension at once", () => {
    const css = serializeRules(
      compileOverrides(
        BUTTON,
        {
          root: ({ ownerState }) => ({
            outline:
              ownerState.type === "primary" && ownerState.size === "large" ? "2px solid" : "none",
          }),
        },
        theme
      )
    );
    // The reason variants are a full cross product rather than per-dimension
    // deltas: a style that only applies to one *pair* of values would be lost.
    expect(css).toContain('[data-type="primary"][data-size="large"] { outline: 2px solid }');
  });

  it("carries nested selectors into every variant that needs them", () => {
    const css = serializeRules(
      compileOverrides(
        BUTTON,
        {
          root: ({ ownerState }) => ({
            "&:hover": { opacity: ownerState.type === "text" ? 0.6 : 1 },
          }),
        },
        theme
      )
    );
    expect(css).toContain('[data-scope="button"][data-part="root"]:hover { opacity: 1 }');
    expect(css).toContain(
      '[data-scope="button"][data-part="root"][data-type="text"]:hover { opacity: 0.6 }'
    );
  });

  it("drops dimensions the style never reads", () => {
    // Opacity depends on `type` alone. Emitting it once per `size` as well
    // would triple the rule for no reason, and that multiplies with every
    // dimension a component gains.
    const rules = compileOverrides(
      BUTTON,
      { root: ({ ownerState }) => ({ opacity: ownerState.type === "text" ? 0.6 : 1 }) },
      theme
    );
    expect(rules).toHaveLength(2); // base, plus one for type=text
    expect(rules.some(r => r.selector.includes("data-size"))).toBe(false);
  });

  it("accepts a plain object as well as a function", () => {
    const rules = compileOverrides(BUTTON, { root: { color: "red" } }, theme);
    expect(rules).toHaveLength(1);
    expect(rules[0]?.declarations).toEqual(["color: red"]);
  });

  it("rejects an unknown part instead of emitting a selector that matches nothing", () => {
    expect(() => compileOverrides(BUTTON, { rooot: { color: "red" } }, theme)).toThrow(
      /has no part "rooot".*root, icon/s
    );
  });

  it("is deterministic", () => {
    const build = () =>
      serializeRules(
        compileOverrides(
          BUTTON,
          { root: ({ ownerState }) => ({ padding: ownerState.size === "large" ? 16 : 8 }) },
          theme
        )
      );
    expect(build()).toBe(build());
  });
});
