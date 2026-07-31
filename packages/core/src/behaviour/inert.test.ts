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

afterEach(() => {
  document.body.innerHTML = "";
});

describe("inertBackground", () => {
  it("inerts the page but not the overlay's own layers", () => {
    const body = html('<div id="app">app</div><div id="overlay"><p id="content">x</p></div>');
    const release = inertBackground(el("#content"));

    expect(isInert("#app")).toBe(true);
    expect(isInert("#overlay")).toBe(false);
    expect(inertDepth()).toBe(1);

    release();
    expect(isInert("#app")).toBe(false);
    expect(inertDepth()).toBe(0);
    void body;
  });

  it("leaves two overlays opened together both usable", () => {
    // Each overlay used to sweep alone and treat every body child not containing
    // its own content as background — which includes the other overlay's layers.
    // Opened one commit apart that was invisible, because the later sweep skips
    // whatever is already inert. Opened together, each inerted the other and both
    // dialogs were visible and untouchable.
    html(
      '<div id="app">app</div><div id="a"><p id="ac">a</p></div><div id="b"><p id="bc">b</p></div>'
    );
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));

    expect(isInert("#a")).toBe(false);
    expect(isInert("#b")).toBe(false);
    expect(isInert("#app")).toBe(true);

    releaseA();
    releaseB();
  });

  it("holds the background until the last overlay leaves, whatever the order", () => {
    // The mirror failure: the first overlay owned the app root, the second
    // skipped it as already inert and owned nothing, so closing the first
    // released the page while the second was still open.
    html(
      '<div id="app">app</div><div id="a"><p id="ac">a</p></div><div id="b"><p id="bc">b</p></div>'
    );
    const releaseA = inertBackground(el("#ac"));
    const releaseB = inertBackground(el("#bc"));

    releaseA();
    expect(isInert("#app")).toBe(true);
    // And the one still open is foreground now that the other is gone.
    expect(isInert("#b")).toBe(false);
    expect(isInert("#a")).toBe(true);

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
