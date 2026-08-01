import { test, expect, type Page } from "@playwright/test";
import { FRAMEWORKS } from "../playwright.config";

const url = (base: string) => (base.endsWith("4173") ? `${base}/?view=parity` : base);

const SECTIONS = [
  "button",
  "icon",
  "badge",
  "alert",
  "card",
  "field",
  "toggle",
  "display",
  "layout",
  "tabs",
  "accordion",
  "table",
] as const;

/**
 * Known gaps, listed rather than hidden.
 *
 * Every entry is a real divergence the matrix found and that is not fixed yet.
 * Naming them keeps the rest of the grid enforced — a regression in any
 * unlisted section still fails — and a gap that quietly closes fails the test
 * until it is removed, so the list cannot rot.
 */
const KNOWN_GAPS = new Set<string>([]);

/**
 * Sections whose contract has moved in some frameworks but not yet all.
 *
 * The v2 rewrite migrates React first and freezes the API there before the
 * other three follow, so for a while the same component genuinely renders
 * different markup per framework — React's Button emits `data-type`, the others
 * still emit `data-variant`. Comparing those is not a bug report, it is the
 * plan.
 *
 * Listed rather than deleted, and skipped by *framework and section* like
 * KNOWN_GAPS, so every other section stays enforced. An entry that stops
 * diverging fails the assertion below, which is what forces it to be removed as
 * each framework lands rather than left to rot.
 *
 * The hole this mechanism opens, and why the test below it exists: React is the
 * comparison baseline, so a React regression does not read as "React broke", it
 * reads as *the other three* diverging — and an excused section swallows that
 * wholesale. A dead React stylesheet would be reported as three excused gaps and
 * pass. Relative comparison cannot see it by construction, so the excused
 * sections need an absolute assertion as well.
 */
const MIGRATING = new Set<string>([
  "vue/button",
  "svelte/button",
  "angular/button",
  // React's Tabs emits `data-type` where the others still emit `data-ck-variant`,
  // and its Collapse renders a heading part and a `region` panel the v1
  // Accordion does not. Both are the rewrite landing in React first.
  "vue/tabs",
  "svelte/tabs",
  "angular/tabs",
  "vue/accordion",
  "svelte/accordion",
  "angular/accordion",
  // React's Select is a button plus a portalled listbox, with `data-size` in a
  // different vocabulary from the v1 `sm`/`md`/`lg` the others still render.
  //
  // `select`, not `field`. An entry here excuses a whole SECTION, and `field`
  // holds two Inputs and a Textarea beside the Select — excusing it stopped
  // checking those three in three frameworks, for a change that never touched
  // them. The fixture gives Select its own section in all four playgrounds so
  // this entry costs exactly what it should.
  "vue/select",
  "svelte/select",
  "angular/select",
]);

/**
 * Sections carrying an absolute assertion, because a relative one cannot cover
 * them. Every section named in MIGRATING needs an entry here; the test below
 * enforces that, so the hole cannot reopen as more sections migrate.
 */
const RESOLVED: Record<string, { part: string; expect: Record<string, string | RegExp> }> = {
  // Both of these assert a BASE rule — one shared by v1 and v2 — for the reason
  // the button entry gives: the question is whether the stylesheet reached this
  // component at all, not whether two contracts agree. A variant rule would
  // answer the wrong one, since the two sides deliberately differ there.
  tabs: {
    part: '[data-part="list"]',
    expect: {
      // `display: flex` and a real gap. The UA default for a div is `block`
      // with no gap, so either wrong value means the rule never applied.
      display: "flex",
      gap: /^(4px|0\.25rem)$/,
    },
  },
  // A base rule again, for the reason the button entry gives: the question is
  // whether the stylesheet reached the control at all, not whether two
  // contracts agree about its size vocabulary.
  select: {
    part: '[data-scope="select"][data-part="trigger"]',
    expect: {
      // A button's UA default is `inline-block` with a real border; both being
      // replaced is the rule having applied.
      display: "flex",
      cursor: "pointer",
    },
  },
  accordion: {
    part: '[data-part="item-trigger"]',
    expect: {
      display: "flex",
      // A button's UA default is `button` for appearance and a real border;
      // both being reset is the stylesheet having reached it.
      borderTopWidth: "0px",
    },
  },
  // The first button in every fixture is the default type. All four adapters
  // pass this today against different contracts — React's v2 rules and v1's for
  // the rest — which is the point: it asks whether the stylesheet is alive, not
  // whether the two agree.
  button: {
    part: '[data-part="root"]',
    expect: {
      // Authored as `inline-flex`, but the fixture row is a flex container and a
      // flex item's display is blockified, so it computes to `flex`. Either is
      // the rule having applied; `block` or `inline-block` is the UA default and
      // means it did not.
      display: /^(inline-)?flex$/,
      // The rule that actually broke: renaming the contract left every selector
      // unmatched, and with no fallback on --ck-button-bg every button rendered
      // transparent and unpadded. Anything but a transparent background means a
      // type rule matched.
      backgroundColor: /^(?!rgba\(0, 0, 0, 0\)$)/,
      // Non-zero, so a button that lost its size rule fails too.
      paddingLeft: /^(?!0px$)/,
      // Nothing about the border: whether the first button in the fixture has
      // one is a property of which type it happens to be, so asserting it would
      // be checking the fixture rather than the stylesheet.
    },
  },
};

/** Layout-visible properties. Compared as strings, so a rem/px difference shows. */
const PROPS = [
  "display",
  "backgroundColor",
  "color",
  "borderTopWidth",
  "borderTopColor",
  "borderRadius",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "opacity",
  "textAlign",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
];

interface Snapshot {
  key: string;
  box: string;
  styles: string;
}

async function capture(page: Page, base: string, section: string): Promise<Snapshot[]> {
  return page.locator(`[data-fixture="${section}"]`).evaluate(
    (root, props) =>
      [...root.querySelectorAll<HTMLElement>("[data-part]")].map(element => {
        const rect = element.getBoundingClientRect();
        const computed = getComputedStyle(element);
        // data-ownedby / data-controls hold generated ids, which differ by
        // construction: React's useId, Vue's v-12, Svelte's c13, Angular's own.
        // They are references, not contract, so they are not compared.
        const ignored = ["data-fixture", "data-ownedby", "data-controls"];
        const identity = [...element.attributes]
          .filter(attr => attr.name.startsWith("data-") && !ignored.includes(attr.name))
          .map(attr => (attr.value === "" ? attr.name : `${attr.name}=${attr.value}`))
          .sort()
          .join(" ");
        return {
          key: identity,
          // Rounded: sub-pixel layout differs harmlessly between engines.
          box: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          styles: props.map(prop => `${prop}:${computed[prop as never]}`).join(";"),
        };
      }),
    PROPS
  );
}

async function settle(page: Page, base: string) {
  await page.goto(url(base));
  // The pointer keeps its position across navigations and table rows are
  // hoverable, so park it; likewise drop focus. Both were producing differences
  // that moved between runs, which is what gave them away as artefacts.
  await page.mouse.move(0, 0);
  await expect(page.locator('[data-fixture="table"] [data-part="row"]').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(400);
}

/**
 * Cross-framework parity, compared as computed styles and geometry rather than
 * as images.
 *
 * This asserts the frameworks match EACH OTHER, not a stored golden image —
 * which is what makes it useful during a port, since the CSS is still moving
 * and a baseline would be invalidated constantly.
 *
 * Screenshots were the first attempt and were the wrong instrument: a byte
 * compare of two PNGs captured in separate page loads drifted by a few dozen
 * bytes for reasons that had nothing to do with the adapters, and reported
 * "42 bytes" rather than which property differed. Computed styles are
 * deterministic and name the offending property.
 *
 * React is the reference only because it was ported first.
 */
test("frameworks render identical styles and geometry", async ({ page }) => {
  const captured = new Map<string, Map<string, Snapshot[]>>();

  for (const framework of FRAMEWORKS) {
    await settle(page, framework.url);
    const perSection = new Map<string, Snapshot[]>();
    for (const section of SECTIONS)
      perSection.set(section, await capture(page, framework.url, section));
    captured.set(framework.name, perSection);
  }

  const reference = captured.get("react")!;
  const differences: string[] = [];
  const unexpectedlyFixed: string[] = [];

  for (const framework of FRAMEWORKS) {
    if (framework.name === "react") continue;
    for (const section of SECTIONS) {
      const gapKey = `${framework.name}/${section}`;
      const a = reference.get(section)!;
      const b = captured.get(framework.name)!.get(section)!;
      const local: string[] = [];

      if (a.length !== b.length) {
        local.push(`${gapKey}: ${a.length} parts in react vs ${b.length}`);
      } else {
        for (let i = 0; i < a.length; i++) {
          if (a[i]!.key !== b[i]!.key) {
            local.push(`${gapKey}#${i}: attrs "${a[i]!.key}" vs "${b[i]!.key}"`);
          } else if (a[i]!.box !== b[i]!.box) {
            local.push(`${gapKey}#${i} [${a[i]!.key}]: box ${a[i]!.box} vs ${b[i]!.box}`);
          } else if (a[i]!.styles !== b[i]!.styles) {
            const mine = a[i]!.styles.split(";");
            const theirs = b[i]!.styles.split(";");
            const prop = mine.find((entry, index) => entry !== theirs[index]);
            local.push(`${gapKey}#${i} [${a[i]!.key}]: ${prop} vs ${theirs[mine.indexOf(prop!)]}`);
          }
        }
      }

      const excused = KNOWN_GAPS.has(gapKey) || MIGRATING.has(gapKey);
      if (local.length && !excused) differences.push(...local.slice(0, 3));
      if (!local.length && excused) unexpectedlyFixed.push(gapKey);
    }
  }

  expect(differences, "adapters that diverge from React").toEqual([]);
  expect(unexpectedlyFixed, "KNOWN_GAPS or MIGRATING entries that now pass — remove them").toEqual(
    []
  );
});

test("every excused section has an absolute assertion to fall back on", () => {
  const uncovered = [...MIGRATING, ...KNOWN_GAPS]
    .map(key => key.split("/")[1]!)
    .filter(section => !(section in RESOLVED));
  expect(uncovered, "excused sections with nothing checking them absolutely").toEqual([]);
});

/**
 * The absolute half: each adapter's own styles resolve, judged against fixed
 * values rather than against another framework.
 *
 * Runs per framework rather than React-only. React is where the hole is, but a
 * stylesheet can die on any of the four, and the same assertion covers all of
 * them for the same three lines.
 */
for (const framework of FRAMEWORKS) {
  test(`${framework.name} resolves its own styles, not only the same ones`, async ({ page }) => {
    await settle(page, framework.url);
    for (const [section, { part, expect: expected }] of Object.entries(RESOLVED)) {
      const element = page.locator(`[data-fixture="${section}"] ${part}`).first();
      const computed = await element.evaluate((node, props) => {
        const style = getComputedStyle(node);
        return Object.fromEntries(props.map(prop => [prop, style[prop as never] as string]));
      }, Object.keys(expected));

      for (const [prop, want] of Object.entries(expected)) {
        const got = computed[prop]!;
        if (typeof want === "string") expect(got, `${section} ${prop}`).toBe(want);
        else expect(got, `${section} ${prop}`).toMatch(want);
      }
    }
  });
}
