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
 */
const MIGRATING = new Set<string>(["vue/button", "svelte/button", "angular/button"]);

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
