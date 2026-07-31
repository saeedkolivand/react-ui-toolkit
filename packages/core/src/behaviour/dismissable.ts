/**
 * Dismissing a layer: Escape, and interaction outside it.
 *
 * The layer stack is why this cannot live inside each component. With two
 * dialogs open, Escape must close the top one and only the top one — but both
 * have a listener on the document, so without a shared stack both fire and both
 * close. Same for an outside click: a click in the second dialog is "outside"
 * the first, and would dismiss it from underneath.
 *
 * One module-level stack, newest last. A layer only acts when it is on top.
 */

import { contains } from "./dom";

export interface DismissableOptions {
  onDismiss: (reason: "escape" | "outside") => void;
  /** Nodes that count as inside — a trigger button, an anchored popup. */
  exclude?: () => Array<HTMLElement | null | undefined>;
  escape?: boolean;
  outside?: boolean;
}

interface Layer {
  node: () => HTMLElement | null;
  options: DismissableOptions;
}

const stack: Layer[] = [];

const topmost = () => stack[stack.length - 1];

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  const layer = topmost();
  if (!layer || layer.options.escape === false) return;
  // Claimed, so a component further out does not also react to this key.
  event.preventDefault();
  layer.options.onDismiss("escape");
}

/**
 * Dismiss on `pointerdown`, not `click`.
 *
 * A `click` fires after `mouseup`, so pressing inside the layer and releasing
 * outside — a text selection dragged past the edge — dismisses it. `pointerdown`
 * asks where the interaction *began*, which is the question that matters.
 */
function onPointerDown(event: PointerEvent) {
  const layer = topmost();
  if (!layer || layer.options.outside === false) return;

  const node = layer.node();
  if (!node) return;

  const target = event.composedPath()[0] as Node | null;
  if (contains(node, target)) return;
  for (const excluded of layer.options.exclude?.() ?? []) {
    if (excluded && contains(excluded, target)) return;
  }

  layer.options.onDismiss("outside");
}

/**
 * `focusin` catches what pointers do not: Tab out of an unTrapped layer, or a
 * screen reader moving focus. Menus and popovers need this; a modal traps focus
 * so it never fires there.
 */
function onFocusIn(event: FocusEvent) {
  const layer = topmost();
  if (!layer || layer.options.outside === false) return;

  const node = layer.node();
  if (!node) return;

  const target = event.target as Node | null;
  if (contains(node, target)) return;
  for (const excluded of layer.options.exclude?.() ?? []) {
    if (excluded && contains(excluded, target)) return;
  }

  layer.options.onDismiss("outside");
}

function attach() {
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("focusin", onFocusIn, true);
}

function detach() {
  document.removeEventListener("keydown", onKeyDown, true);
  document.removeEventListener("pointerdown", onPointerDown, true);
  document.removeEventListener("focusin", onFocusIn, true);
}

/**
 * Registers a layer. Returns the function that removes it.
 *
 * Listeners exist only while at least one layer does, so a page with no
 * overlays open carries no document-level handlers at all.
 */
export function pushDismissable(
  node: () => HTMLElement | null,
  options: DismissableOptions
): () => void {
  const layer: Layer = { node, options };
  if (stack.length === 0) attach();
  stack.push(layer);

  return () => {
    const index = stack.indexOf(layer);
    if (index === -1) return;
    // Spliced by identity, not popped: layers can close out of order, and
    // popping would remove whichever happened to be on top.
    stack.splice(index, 1);
    if (stack.length === 0) detach();
  };
}

/** How many layers are open. Exposed so tests can assert cleanup is balanced. */
export const dismissableDepth = () => stack.length;
