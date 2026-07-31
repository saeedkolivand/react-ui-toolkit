/**
 * Hiding everything outside the open overlays from assistive technology.
 *
 * `inert` rather than `aria-hidden`: it removes the subtree from the
 * accessibility tree *and* stops it receiving focus or clicks, so a screen
 * reader's own navigation — which does not use Tab and therefore never meets a
 * focus trap — cannot walk out of a dialog into the page behind it.
 *
 * Applied to `document.body`'s children rather than to one wrapper, because an
 * overlay is portalled and is therefore a sibling of the app root, not a
 * descendant of it.
 *
 * Shared, for the same reason `dismissable` and `focus-trap` are. Each overlay
 * used to sweep on its own and treat every body child that did not contain *its*
 * content as background — which includes another overlay's layers. That survived
 * only while overlays opened one commit apart, because a later sweep skips
 * whatever is already inert and nothing re-runs the earlier one. Open two in the
 * same commit and both sweeps see the other's positioner already in the DOM, so
 * each inerts the other and both dialogs end up visible and untouchable:
 * `getTabbables` returns nothing, and a browser blocks pointer events too.
 *
 * The same single-owner assumption broke closing, in the opposite direction. The
 * first overlay owned the app root; the second skipped it as already inert and
 * owned nothing. Closing the first — a route change, a consumer clearing both
 * flags — released the page while the second was still open, which is precisely
 * the hole `inert` was chosen to close.
 *
 * So: one registry of open overlay contents, and one recomputation whenever it
 * changes. A body child is background when it contains none of them, the
 * background is inert until the last overlay leaves, and nothing an overlay does
 * touches another overlay's layers.
 */

/** The content node of each open overlay. Order is irrelevant; membership is not. */
const layers: HTMLElement[] = [];

/**
 * Only what this module set.
 *
 * A consumer's own `inert` is left exactly as found — set before, still set
 * after. Tracking ours separately is what makes releasing safe.
 */
const ours = new Set<HTMLElement>();

function apply() {
  const background = new Set<HTMLElement>();
  // Nothing is background when nothing is foreground. Without this guard the
  // last overlay closing leaves every child still "background" and the release
  // loop below skips them all, so the page stays inert forever.
  if (layers.length > 0) {
    for (const child of document.body.children) {
      if (!(child instanceof HTMLElement)) continue;
      // Any open overlay's layer is foreground, not just the one registering.
      if (layers.some(layer => child.contains(layer))) continue;
      background.add(child);
    }
  }

  for (const element of [...ours]) {
    if (background.has(element)) continue;
    element.inert = false;
    ours.delete(element);
  }

  for (const element of background) {
    // Read as an attribute, not as the IDL property: a consumer writes it in
    // markup, and jsdom does not reflect one to the other. Already inert and
    // not ours means they set it — leave it, and do not record it, so it
    // survives the last overlay closing.
    if (ours.has(element) || element.hasAttribute("inert")) continue;
    element.inert = true;
    ours.add(element);
  }
}

/**
 * Registers an overlay's content as foreground. Returns the function that
 * unregisters it.
 */
export function inertBackground(content: HTMLElement): () => void {
  layers.push(content);
  apply();

  return () => {
    // Spliced by identity, not popped: overlays close out of order.
    const index = layers.indexOf(content);
    if (index === -1) return;
    layers.splice(index, 1);
    apply();
  };
}

/** How many overlays hold the background inert. Exposed so tests can assert balance. */
export const inertDepth = () => layers.length;
