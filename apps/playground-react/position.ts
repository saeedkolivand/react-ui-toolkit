/**
 * Positioner harness. No framework — `position.ts` has none, so proving it
 * should not drag one in.
 *
 * The page exposes `window.place()` rather than reading its configuration from
 * the URL, so the whole matrix (12 placements x 9 anchor positions x 2
 * directions) runs against one page load instead of 216 navigations.
 */
import {
  applyPosition,
  attachPosition,
  measure,
  type PlacementAlias,
  type ComputePositionOptions,
} from "@crosskit-ui/core";

const anchor = document.getElementById("anchor")!;
const floating = document.getElementById("floating")! as HTMLElement;
const label = document.getElementById("label")!;

/** Named anchor positions, as fractions of the viewport. */
const SPOTS = {
  topStart: [0, 0],
  top: [0.5, 0],
  topEnd: [1, 0],
  start: [0, 0.5],
  center: [0.5, 0.5],
  end: [1, 0.5],
  bottomStart: [0, 1],
  bottom: [0.5, 1],
  bottomEnd: [1, 1],
} as const;

export type Spot = keyof typeof SPOTS;

export interface PlaceRequest extends ComputePositionOptions {
  placement: PlacementAlias;
  spot: Spot;
  anchorSize?: [number, number];
  /** "auto" leaves the element to size itself, which is where a static box differs. */
  floatingSize?: [number, number] | "auto";
}

function place(request: PlaceRequest) {
  const {
    spot,
    anchorSize = [100, 40],
    floatingSize = [200, 100],
    rtl = false,
    ...options
  } = request;

  document.documentElement.dir = rtl ? "rtl" : "ltr";

  const [fx, fy] = SPOTS[spot];
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  anchor.style.width = `${anchorSize[0]}px`;
  anchor.style.height = `${anchorSize[1]}px`;
  anchor.style.left = `${Math.round((vw - anchorSize[0]) * fx)}px`;
  anchor.style.top = `${Math.round((vh - anchorSize[1]) * fy)}px`;

  if (floatingSize === "auto") {
    floating.style.width = "";
    floating.style.height = "";
  } else {
    floating.style.width = `${floatingSize[0]}px`;
    floating.style.height = `${floatingSize[1]}px`;
  }
  label.textContent = request.placement;

  const result = measure(anchor, floating, { ...options, rtl, arrow: { size: 8, padding: 6 } });
  applyPosition(floating, result);

  const box = floating.getBoundingClientRect();
  return {
    ...result,
    // Reported from the DOM, not from the maths, so the assertions check what
    // actually landed on screen rather than what we intended to write.
    rect: { x: box.x, y: box.y, width: box.width, height: box.height },
    viewport: { width: vw, height: vh },
    arrowDetached: floating.dataset.arrowDetached !== undefined,
  };
}

/**
 * Live mode: lay the anchor out once, then let `autoUpdate` keep the floating
 * element on it. Used to prove the listeners are wired, which the one-shot
 * `place()` path cannot show.
 */
let detach: (() => void) | undefined;

function attach(request: PlaceRequest) {
  detach?.();
  place(request);
  const { spot: _spot, anchorSize: _a, floatingSize: _f, ...options } = request;
  detach = attachPosition(anchor, floating, { ...options, arrow: { size: 8, padding: 6 } });
}

function stop() {
  detach?.();
  detach = undefined;
}

/** What actually ended up on screen, for assertions after an async reposition. */
function current() {
  const box = floating.getBoundingClientRect();
  return {
    rect: { x: box.x, y: box.y, width: box.width, height: box.height },
    placement: floating.dataset.placement,
    viewport: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
  };
}

declare global {
  interface Window {
    place: typeof place;
    attach: typeof attach;
    stop: typeof stop;
    current: typeof current;
  }
}

window.place = place;
window.attach = attach;
window.stop = stop;
window.current = current;
