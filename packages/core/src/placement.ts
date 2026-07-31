import type { Placement } from "./types";

/** v0 used Ant Design's placement names, which Floating UI does not understand. */
export type LegacyPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

const LEGACY: Record<LegacyPlacement, Placement> = {
  top: "top",
  left: "left",
  right: "right",
  bottom: "bottom",
  topLeft: "top-start",
  topRight: "top-end",
  bottomLeft: "bottom-start",
  bottomRight: "bottom-end",
  leftTop: "left-start",
  leftBottom: "left-end",
  rightTop: "right-start",
  rightBottom: "right-end",
};

/**
 * Accepts either naming and returns the Floating UI one, so `placement="topLeft"`
 * keeps working for anyone migrating from v0.
 */
export function resolvePlacement(
  placement: Placement | LegacyPlacement | undefined,
  fallback: Placement = "top"
): Placement {
  if (!placement) return fallback;
  return LEGACY[placement as LegacyPlacement] ?? (placement as Placement);
}

/**
 * `focus` and `blur` do not bubble, so a component that wraps a consumer's
 * element (Tooltip) has to listen for `focusin`/`focusout` instead — and then
 * re-apply the guard those handlers would have had, or a mouse click on the
 * trigger pops the tooltip.
 *
 * ponytail: `:focus-visible` is the browser's own answer to "was this keyboard
 * focus", so there is nothing to track. jsdom does not implement it, hence the
 * catch: in a test environment, treat focus as visible.
 */
export function isFocusVisible(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}
