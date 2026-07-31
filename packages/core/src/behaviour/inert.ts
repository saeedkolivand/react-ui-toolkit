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
 * changes, with exactly one overlay foreground — the topmost.
 *
 * Topmost rather than "every registered overlay". Treating them all as
 * foreground also fixes the mutual-destruction bug, but it means a dialog opened
 * on top of another leaves the one below reachable, which is the contract in the
 * first paragraph: a screen reader walks out of the top dialog into the one
 * behind it, and programmatic focus lands on a control the user cannot see the
 * top of. Two open modal dialogs means one of them is behind the other, and
 * "behind a modal" is the case this exists for.
 *
 * Recomputing on every change is what makes that safe to unwind: closing the top
 * overlay makes the next one topmost and un-inerts it in the same call, before
 * its trap takes focus back.
 */

/** The content node of each open overlay, oldest first. The last one is on top. */
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
  const topmost = layers[layers.length - 1];
  if (topmost) {
    for (const child of document.body.children) {
      if (!(child instanceof HTMLElement)) continue;
      // Only the topmost overlay's layers. A lower overlay is behind a modal,
      // which is exactly what should be unreachable.
      if (child.contains(topmost)) continue;
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
