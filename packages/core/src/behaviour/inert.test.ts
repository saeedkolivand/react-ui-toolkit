import { afterEach, describe, expect, it } from "vitest";
import { inertBackground, inertDepth } from "./inert";

const html = (markup: string) => {
  document.body.innerHTML = markup;
  return document.body;
};

const el = (selector: string) => document.querySelector<HTMLElement>(selector)!;

/**
 * `.inert` is `undefined` on an element nothing has set it on — jsdom does not
 * implement the IDL attribute, so it is a plain expando here. Asserting the
 * meaning rather than the value keeps these tests about the contract.
 */
const isInert = (selector: string) => el(selector).inert === true;

const three = () =>
  html(
    '<div id="app">app</div><div id="a"><p id="ac">a</p></div><div id="b"><p id="bc">b</p></div>'
  );

afterEach(() => {
  document.body.innerHTML = "";
});

describe("inertBackground", () => {
  it("inerts the page but not the overlay's own layers", () => {
    html('<div id="app">app</div><div id="overlay"><p id="content">x</p></div>');
    const release = inertBackground(el("#content"));

    expect(isInert("#app")).toBe(true);
    expect(isInert("#overlay")).toBe(false);
    expect(inertDepth()).toBe(1);

    release();
    expect(isInert("#app")).toBe(false);
    expect(inertDepth()).toBe(0);
  });

  it("leaves the topmost overlay usable when two open in one commit", () => {
    // Each overlay used to sweep alone and treat every body child that did not
    // contain its own content as background — which includes the other overlay's
    // layers. Opened one commit apart that was invisible, because the later
    // sweep skips whatever is already inert and nothing re-runs the earlier one.
    // Opened together, each inerted the other and BOTH dialogs were visible and
    // untouchable.
    three();
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));

    expect(isInert("#b")).toBe(false);
    expect(isInert("#app")).toBe(true);

    releaseA();
    releaseB();
  });

  it("keeps the layer below a stacked overlay unreachable", () => {
    // The over-correction the fix above invites: treating every registered
    // overlay as foreground also solves mutual destruction, but then a dialog
    // opened on top of another leaves the lower one in the accessibility tree
    // and accepting focus — a screen reader walks out of the top dialog into the
    // one behind it. Exactly one overlay is foreground, and it is the topmost.
    three();
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));

    expect(isInert("#a")).toBe(true);

    releaseA();
    releaseB();
  });

  it("hands foreground back to the layer below when the top one closes", () => {
    three();
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));
    expect(isInert("#a")).toBe(true);

    // Released in the same call, before the lower overlay's trap takes focus
    // back — so the element focus returns to is focusable by the time it is
    // focused.
    releaseB();
    expect(isInert("#a")).toBe(false);
    expect(isInert("#app")).toBe(true);

    releaseA();
    expect(isInert("#app")).toBe(false);
  });

  it("holds the background until the last overlay leaves, whatever the order", () => {
    // The mirror of the mutual-inert failure: the first overlay owned the app
    // root, the second skipped it as already inert and owned nothing, so closing
    // the first released the page while the second was still open.
    three();
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));

    // The lower one closes first — a route change, a consumer clearing both.
    releaseA();
    expect(isInert("#app")).toBe(true);
    expect(isInert("#b")).toBe(false);

    releaseB();
    expect(isInert("#app")).toBe(false);
  });

  it("leaves a consumer's own inert exactly as it found it", () => {
    html(
      '<div id="app">app</div><div id="theirs" inert>theirs</div><div id="o"><p id="c">x</p></div>'
    );
    expect(el("#theirs").hasAttribute("inert")).toBe(true);

    const release = inertBackground(el("#c"));
    release();

    // Set before, still set after. Releasing what we never took would hand a
    // consumer back a page they had deliberately disabled.
    expect(el("#theirs").hasAttribute("inert")).toBe(true);
  });
});
