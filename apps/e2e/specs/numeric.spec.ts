import { test, expect, type Page } from "@playwright/test";

/** Centre of an element, rounded — the only thing that matters for centring. */
const centre = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  });

const centres = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    })
  );

const CASES = [
  ["h-ltr", "horizontal LTR"],
  ["h-rtl", "horizontal RTL"],
  ["v-ltr", "vertical LTR"],
  ["v-rtl", "vertical RTL"],
] as const;

for (const [id, description] of CASES) {
  test(`centres the thumb on the track, ${description}`, async ({ page }) => {
    await page.goto("/numeric.html");
    await expect(page.locator(`#${id} [data-part="thumb"]`)).toHaveCount(1);

    const thumb = await centre(page, `#${id} [data-part="thumb"]`);
    const track = await centre(page, `#${id} [data-part="track"]`);

    // `translate` is physical whatever the offset property beside it is, so a
    // mirror written for one direction is missing in the other. At 50% the
    // thumb's centre is the track's centre on both axes, in every combination
    // — which is the one assertion that holds without knowing which is which.
    expect(Math.abs(thumb.x - track.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(thumb.y - track.y)).toBeLessThanOrEqual(1);
  });

  test(`spaces the marks evenly, ${description}`, async ({ page }) => {
    await page.goto("/numeric.html");
    const marks = await centres(page, `#${id} [data-part="mark"]`);
    expect(marks).toHaveLength(4);

    const vertical = id.startsWith("v");
    // Marks at 0, 25, 50 and 100 sit at fixed fractions of the track, so the
    // gaps run 25, 25, 50 whichever way the axis points. Compared as ratios
    // rather than pixels, since the track length differs per case.
    const along = marks.map(mark => (vertical ? mark.y : mark.x));
    const span = Math.abs(along[3]! - along[0]!);
    expect(span).toBeGreaterThan(20);
    const gaps = [1, 2, 3].map(i => Math.abs(along[i]! - along[i - 1]!) / span);
    expect(gaps.map(g => Math.round(g * 100))).toEqual([25, 25, 50]);

    // And anchored, not merely evenly spaced. A missing RTL mirror shifts every
    // mark by the same amount, which even spacing cannot see — so the mark at
    // 50 is checked against the thumb, which is also at 50.
    const thumb = await centre(page, `#${id} [data-part="thumb"]`);
    expect(Math.abs(marks[2]!.x - thumb.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(marks[2]!.y - thumb.y)).toBeLessThanOrEqual(1);
  });

  test(`puts each mark label on its own mark, ${description}`, async ({ page }) => {
    await page.goto("/numeric.html");
    const labels = await centres(page, `#${id} [data-part="mark-label"]`);
    const marks = await centres(page, `#${id} [data-part="mark"]`);
    expect(labels).toHaveLength(2);

    // Labels are on the marks at 0 and 50, which are the first and third — and
    // aligned along the track's own axis. A vertical slider puts its labels
    // beside the track rather than under it, so comparing x there would be
    // asserting the offset rather than the alignment.
    const axis = id.startsWith("v") ? "y" : ("x" as const);
    expect(Math.abs(labels[0]![axis] - marks[0]![axis])).toBeLessThanOrEqual(1);
    expect(Math.abs(labels[1]![axis] - marks[2]![axis])).toBeLessThanOrEqual(1);
  });
}

test("clips a half-filled rate symbol to half its width", async ({ page }) => {
  await page.goto("/numeric.html");
  const fills = await page
    .locator('#rate-half [data-part="star"] [data-part="star-fill"]')
    .evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().width)));
  const bases = await page
    .locator('#rate-half [data-part="star"] [data-part="star-base"]')
    .evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().width)));

  // Measured against the base beside it, not a number: the half symbol is the
  // one that needs two layers, and a fill that covered the whole width would
  // look like a full star with no error anywhere.
  expect(fills[0]).toBe(bases[0]);
  expect(fills[2]).toBe(Math.round(bases[2]! / 2));
  expect(fills[3]).toBe(0);
});
