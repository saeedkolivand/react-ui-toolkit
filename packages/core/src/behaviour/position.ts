/**
 * Anchor positioning, as pure geometry.
 *
 * This file is deliberately free of the DOM. It takes rectangles and returns
 * coordinates; `autoUpdate` in ./position-dom.ts is the part that reads and
 * writes the document. That split is the whole reason this is tractable to own:
 * every flip, shift and RTL case is a cheap unit test on plain numbers, so the
 * hard part never needs a browser to verify.
 *
 * Coordinate space is the caller's choice — viewport or document — as long as
 * `anchor`, `floating` and `boundary` all agree. x/y is the floating element's
 * top-left corner.
 */

// `Side` and `Placement` come from ../types rather than being redeclared here.
// Two `export *` sources exporting the same name makes it ambiguous, and an
// ambiguous star export is silently dropped from the barrel rather than being
// an error — so the duplicate would have quietly deleted `Placement` from the
// package's public types.
import type { Placement, Side } from "../types";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Align = "start" | "center" | "end";

/**
 * The camelCase placement vocabulary, which is the public API in v2. Accepted
 * directly rather than translated at every call site, because a translation
 * table is the kind of thing that gets applied twice.
 */
export type PlacementAlias =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

const ALIAS_TO_CANONICAL: Record<PlacementAlias, Placement> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  topLeft: "top-start",
  topRight: "top-end",
  bottomLeft: "bottom-start",
  bottomRight: "bottom-end",
  leftTop: "left-start",
  leftBottom: "left-end",
  rightTop: "right-start",
  rightBottom: "right-end",
};

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export function toCanonicalPlacement(placement: PlacementAlias | Placement): Placement {
  return ALIAS_TO_CANONICAL[placement as PlacementAlias] ?? (placement as Placement);
}

export function parsePlacement(placement: PlacementAlias | Placement): {
  side: Side;
  align: Align;
} {
  const [side, align] = toCanonicalPlacement(placement).split("-") as [Side, Align | undefined];
  return { side, align: align ?? "center" };
}

export function formatPlacement(side: Side, align: Align): Placement {
  return (align === "center" ? side : `${side}-${align}`) as Placement;
}

export interface ArrowOptions {
  /** Length of the arrow along the axis it sits on. */
  size: number;
  /** Minimum distance the arrow keeps from the floating element's corners. */
  padding?: number;
}

export interface ComputePositionOptions {
  placement?: PlacementAlias | Placement;
  /** Gap between anchor and floating element. */
  offset?: number;
  /** Minimum gap the floating element keeps from the boundary. */
  padding?: number;
  /** Move to the opposite side when the preferred one does not fit. */
  flip?: boolean;
  /** Slide along the cross axis to stay inside the boundary. */
  shift?: boolean;
  /** Mirror the inline axis, as `dir="rtl"` requires. */
  rtl?: boolean;
  arrow?: ArrowOptions;
}

export interface ArrowPosition {
  /** Offset within the floating element, on whichever axis the arrow slides. */
  x?: number;
  y?: number;
  /**
   * How far the arrow had to be pushed away from the anchor's centre to stay
   * inside the floating element. Non-zero means the arrow is no longer pointing
   * at the anchor, which is the signal to hide it.
   */
  centerOffset: number;
}

export interface Position {
  x: number;
  y: number;
  /** The placement actually used, which differs from the requested one after a flip. */
  placement: Placement;
  arrow?: ArrowPosition;
  /**
   * How much room the chosen side actually has, measured from the anchor to the
   * boundary edge and already minus `offset` and `padding`.
   *
   * A scrolling popup — a menu, a listbox — has to cap itself against this or it
   * runs off the screen with its last items unreachable, and neither flip nor
   * shift can help once the content is taller than either side. Reported rather
   * than applied, because only the caller knows whether its content scrolls.
   *
   * Optional so that adding it stayed a `minor`. `computePosition` always
   * produces it, but this is an exported interface, and a caller hand-building
   * a `Position` — which `applyPosition`'s own docblock invites — compiled
   * before and would not after.
   */
  available?: { width: number; height: number };
  /**
   * The anchor's width, for a popup that should match it rather than its own
   * content — a listbox belongs to its trigger and should not resize as the
   * options change. Optional for the same reason `available` is.
   */
  anchorWidth?: number;
}

const isVertical = (side: Side) => side === "top" || side === "bottom";

const clamp = (value: number, min: number, max: number) =>
  // max < min when the floating element is larger than the boundary. Pinning to
  // `min` then keeps the top/left edge visible, which is the useful half.
  Math.min(Math.max(value, min), Math.max(min, max));

/**
 * RTL mirrors the inline axis only.
 *
 * For `top`/`bottom` that means alignment flips (`topLeft` visually becomes
 * `topRight`); for `left`/`right` the side itself flips, while its `-start`/
 * `-end` alignment rides the block axis and is untouched. Getting this wrong in
 * one direction only is the classic RTL bug, so both halves are tested.
 */
function mirror(side: Side, align: Align): { side: Side; align: Align } {
  if (isVertical(side)) {
    return { side, align: align === "start" ? "end" : align === "end" ? "start" : "center" };
  }
  return { side: OPPOSITE[side], align };
}

/** Top-left of the floating element for a given side/align, ignoring boundaries. */
function place(anchor: Rect, floating: Rect, side: Side, align: Align, offset: number) {
  const alignOffset = (anchorSize: number, floatingSize: number) =>
    align === "start"
      ? 0
      : align === "end"
        ? anchorSize - floatingSize
        : (anchorSize - floatingSize) / 2;

  switch (side) {
    case "top":
      return {
        x: anchor.x + alignOffset(anchor.width, floating.width),
        y: anchor.y - floating.height - offset,
      };
    case "bottom":
      return {
        x: anchor.x + alignOffset(anchor.width, floating.width),
        y: anchor.y + anchor.height + offset,
      };
    case "left":
      return {
        x: anchor.x - floating.width - offset,
        y: anchor.y + alignOffset(anchor.height, floating.height),
      };
    case "right":
      return {
        x: anchor.x + anchor.width + offset,
        y: anchor.y + alignOffset(anchor.height, floating.height),
      };
  }
}

/** How far past the boundary the floating element sits on its own side. Never negative. */
function overflowOnSide(
  pos: { x: number; y: number },
  floating: Rect,
  boundary: Rect,
  side: Side,
  padding: number
): number {
  switch (side) {
    case "top":
      return Math.max(0, boundary.y + padding - pos.y);
    case "bottom":
      return Math.max(0, pos.y + floating.height - (boundary.y + boundary.height - padding));
    case "left":
      return Math.max(0, boundary.x + padding - pos.x);
    case "right":
      return Math.max(0, pos.x + floating.width - (boundary.x + boundary.width - padding));
  }
}

export function computePosition(
  anchor: Rect,
  floating: Rect,
  boundary: Rect,
  options: ComputePositionOptions = {}
): Position {
  const {
    placement = "top",
    offset = 0,
    padding = 0,
    flip = true,
    shift = true,
    rtl = false,
    arrow,
  } = options;

  const requested = parsePlacement(placement);
  // Alignment is fixed once resolved; only the side can change, and only by flip.
  const { side: initialSide, align } = rtl ? mirror(requested.side, requested.align) : requested;
  let side = initialSide;

  let pos = place(anchor, floating, side, align, offset);

  if (flip) {
    const overflow = overflowOnSide(pos, floating, boundary, side, padding);
    if (overflow > 0) {
      const opposite = OPPOSITE[side];
      const flipped = place(anchor, floating, opposite, align, offset);
      // Only take the flip if it is genuinely better. A tooltip in a viewport
      // too short for either side must not oscillate between them.
      if (overflowOnSide(flipped, floating, boundary, opposite, padding) < overflow) {
        side = opposite;
        pos = flipped;
      }
    }
  }

  if (shift) {
    if (isVertical(side)) {
      pos.x = clamp(
        pos.x,
        boundary.x + padding,
        boundary.x + boundary.width - padding - floating.width
      );
    } else {
      pos.y = clamp(
        pos.y,
        boundary.y + padding,
        boundary.y + boundary.height - padding - floating.height
      );
    }
  }

  // Measured on the side finally used, so a flip reports the room it flipped
  // into rather than the room it rejected.
  const gap = offset + padding;
  const available = {
    width:
      side === "left"
        ? anchor.x - boundary.x - gap
        : side === "right"
          ? boundary.x + boundary.width - (anchor.x + anchor.width) - gap
          : boundary.width - padding * 2,
    height:
      side === "top"
        ? anchor.y - boundary.y - gap
        : side === "bottom"
          ? boundary.y + boundary.height - (anchor.y + anchor.height) - gap
          : boundary.height - padding * 2,
  };

  const result: Position = {
    x: pos.x,
    y: pos.y,
    placement: formatPlacement(side, align),
    // Never negative: an anchor scrolled off the edge would otherwise produce a
    // `max-height` a browser rejects, silently restoring the unbounded box.
    available: { width: Math.max(0, available.width), height: Math.max(0, available.height) },
    anchorWidth: anchor.width,
  };

  if (arrow) {
    const arrowPadding = arrow.padding ?? 0;
    const axis = isVertical(side) ? "x" : "y";
    const floatingSize = isVertical(side) ? floating.width : floating.height;
    const anchorStart = isVertical(side) ? anchor.x : anchor.y;
    const anchorSize = isVertical(side) ? anchor.width : anchor.height;

    // Where the arrow wants to be: centred on the anchor, expressed relative to
    // the floating element's own box.
    const wanted = anchorStart + anchorSize / 2 - pos[axis] - arrow.size / 2;
    const bounded = clamp(wanted, arrowPadding, floatingSize - arrow.size - arrowPadding);

    result.arrow = { [axis]: bounded, centerOffset: wanted - bounded } as ArrowPosition;
  }

  return result;
}
