import { afterEach, describe, expect, it } from "vitest";
import { getTabbables, isTabbable } from "./dom";

const html = (markup: string) => {
  document.body.innerHTML = markup;
  return document.body;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("tabbable query", () => {
  it("excludes disabled and negative-tabindex elements", () => {
    const body = html(`
      <button id="a">a</button>
      <button id="b" disabled>b</button>
      <div id="c" tabindex="-1">c</div>
      <a id="d" href="#">d</a>
      <a id="e">e</a>
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["a", "d"]);
  });

  it("sorts positive tabindex ahead of document order", () => {
    // Using positive tabindex is a mistake, but honouring it means a consumer's
    // markup behaves the same inside a trap as outside one.
    const body = html(`
      <button id="natural">n</button>
      <button id="second" tabindex="2">2</button>
      <button id="first" tabindex="1">1</button>
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["first", "second", "natural"]);
  });

  it("treats a radio group as one stop", () => {
    const body = html(`
      <input type="radio" name="g" id="r1">
      <input type="radio" name="g" id="r2" checked>
      <input type="radio" name="g" id="r3">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r2"]);
  });

  it("uses the first radio when none is checked", () => {
    const body = html(`
      <input type="radio" name="g" id="r1">
      <input type="radio" name="g" id="r2">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r1"]);
  });

  it("does not let a disabled radio take the group out of the tab order", () => {
    // A disabled radio was still eligible to win the "which one is the stop"
    // election, so every enabled sibling answered false and the whole group
    // became unreachable — where a browser makes the first enabled one the stop.
    const body = html(`
      <input type="radio" name="g" id="r1" disabled>
      <input type="radio" name="g" id="r2">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r2"]);
  });

  it("skips past a checked radio that is disabled", () => {
    const body = html(`
      <input type="radio" name="g" id="r1" disabled checked>
      <input type="radio" name="g" id="r2">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r2"]);
  });

  it("excludes anything inside an inert subtree", () => {
    const body = html('<div inert><button id="a">a</button></div>');
    expect(isTabbable(body.querySelector<HTMLElement>("#a")!)).toBe(false);
  });
});
