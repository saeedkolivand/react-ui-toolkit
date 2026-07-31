/**
 * The DOM half of anchor positioning: read rects, write coordinates, and keep
 * the two in sync. All the actual geometry lives in ./position.ts.
 *
 * Two decisions worth stating, because both are load-bearing:
 *
 * 1. **The floating element is `position: fixed`, always.** Viewport
 *    coordinates mean `getBoundingClientRect()` needs no correction, and the
 *    entire class of offset-parent bugs — a `transform` on an ancestor
 *    silently becoming the containing block, `position: relative` wrappers,
 *    scroll containers — simply cannot happen. The stylesheet enforces it.
 *
 * 2. **Position is written to `left`/`top`, not `transform`.** `transform` is
 *    reserved for the animation layer, which scales and translates these same
 *    elements on enter and exit. Sharing the property would mean every
 *    animation had to know the current offset and re-apply it.
 */

import { computePosition, type ComputePositionOptions, type Position, type Rect } from "./position";

export const rectOf = (el: Element): Rect => {
  const { x, y, width, height } = el.getBoundingClientRect();
  return { x, y, width, height };
};

export const viewportRect = (win: Window = window): Rect => ({
  x: 0,
  y: 0,
  // `documentElement.clientWidth` excludes the classic scrollbar; `innerWidth`
  // does not. Using innerWidth puts the shift boundary underneath the scrollbar.
  width: win.document.documentElement.clientWidth,
  height: win.document.documentElement.clientHeight,
});

/** Every scrollable ancestor, plus the window — the things that move an anchor. */
export function scrollParents(el: Element): Array<Element | Window> {
  const parents: Array<Element | Window> = [];
  let node: Element | null = el.parentElement;
  while (node) {
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/auto|scroll|overlay|hidden|clip/.test(overflow + overflowX + overflowY)) {
      parents.push(node);
    }
    node = node.parentElement;
  }
  parents.push(el.ownerDocument.defaultView ?? window);
  return parents;
}

export interface PositionResult extends Position {
  rtl: boolean;
}

export function measure(
  anchor: Element,
  floating: HTMLElement,
  options: ComputePositionOptions = {}
): PositionResult {
  // Read direction off the anchor rather than taking it as a prop: it is what the
  // the `dir` attribute sets on an ancestor, and the DOM already
  // resolves inheritance for us.
  const rtl = options.rtl ?? getComputedStyle(anchor).direction === "rtl";
  const win = floating.ownerDocument.defaultView ?? window;
  return {
    ...computePosition(rectOf(anchor), rectOf(floating), viewportRect(win), { ...options, rtl }),
    rtl,
  };
}

/**
 * Writes the computed position. `data-placement` carries the *resolved*
 * placement so the stylesheet can point the arrow and choose the enter
 * animation's direction — after any flip, which is the only value that matches
 * what the user sees.
 */
export function applyPosition(floating: HTMLElement, position: PositionResult): void {
  floating.style.left = `${position.x}px`;
  floating.style.top = `${position.y}px`;
  floating.dataset.placement = position.placement;

  if (position.arrow) {
    const { x, y, centerOffset } = position.arrow;
    if (x !== undefined) floating.style.setProperty("--ck-arrow-x", `${x}px`);
    if (y !== undefined) floating.style.setProperty("--ck-arrow-y", `${y}px`);
    // An arrow that no longer touches its anchor points at nothing; the
    // stylesheet hides it on this attribute rather than guessing.
    if (centerOffset !== 0) floating.dataset.arrowDetached = "";
    else delete floating.dataset.arrowDetached;
  }
}

/**
 * Reposition on everything that can move an anchor: ancestor scrolling, window
 * resize, and either element changing size. Returns the cleanup function.
 *
 * ponytail: no rAF polling loop. Scroll, resize and ResizeObserver cover every
 * cause except an ancestor being transformed by an animation — add a loop only
 * if that turns out to matter in practice.
 */
export function autoUpdate(
  anchor: Element,
  floating: HTMLElement,
  onUpdate: () => void
): () => void {
  const parents = scrollParents(anchor);
  for (const p of parents) p.addEventListener("scroll", onUpdate, { passive: true });

  const win = floating.ownerDocument.defaultView ?? window;
  win.addEventListener("resize", onUpdate, { passive: true });

  // Observed after the listeners are attached, and it fires once on observe —
  // which doubles as the initial positioning pass.
  const observer = new ResizeObserver(onUpdate);
  observer.observe(anchor);
  observer.observe(floating);

  return () => {
    for (const p of parents) p.removeEventListener("scroll", onUpdate);
    win.removeEventListener("resize", onUpdate);
    observer.disconnect();
  };
}

/** The whole thing: position now, and keep it positioned. Returns cleanup. */
export function attachPosition(
  anchor: Element,
  floating: HTMLElement,
  options: ComputePositionOptions = {}
): () => void {
  const update = () => applyPosition(floating, measure(anchor, floating, options));
  return autoUpdate(anchor, floating, update);
}
