import "@testing-library/jest-dom/vitest";

// jsdom ships no ResizeObserver, and Floating UI's autoUpdate constructs one the
// moment any popper-positioned part (Select, Menu, Tooltip) opens.
// ponytail: a no-op stub is enough — jsdom reports zero dimensions anyway, so
// there is nothing real to observe. Positioning itself is Playwright's job.
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Same story for scrolling: jsdom implements neither, and zag calls both to keep
// the highlighted option in view. Left unstubbed they throw mid-interaction and
// take the whole event down with them.
Element.prototype.scrollTo ??= () => {};
Element.prototype.scrollIntoView ??= () => {};
