/**
 * DOM queries the behaviour primitives share.
 *
 * The tabbable query is the important one: focus trapping, roving tabindex and
 * focus restore all depend on agreeing about what "focusable" means, and a
 * disagreement between them shows up as focus escaping a modal — the exact
 * failure that makes a component library unusable with a keyboard.
 */

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

/**
 * Visible in the sense that matters for focus.
 *
 * `checkVisibility()` is the platform's own answer to this question: it accounts
 * for `display: none` at any depth, `visibility`, and `content-visibility` in
 * one call, which a hand-rolled check gets wrong on ancestors.
 *
 * Where it is missing, fall back to what can be decided without layout and be
 * *permissive*. A wrong "invisible" silently drops an element from the tab
 * order — far worse here than a wrong "visible", which at most leaves a stop on
 * something unreachable.
 */
export function isVisible(element: HTMLElement): boolean {
  if (element.hidden) return false;
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true });
  }
  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

/** Whether the element takes focus from a Tab press. */
export function isTabbable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.matches("[inert], [inert] *")) return false;
  // A radio in a group: only the checked one is tabbable, or the first if none
  // is. Getting this wrong puts every radio in the tab order, which is the most
  // common tabbable-query bug.
  if (element instanceof HTMLInputElement && element.type === "radio" && element.name) {
    const group = element.form ?? element.ownerDocument;
    const radios = [
      ...group.querySelectorAll<HTMLInputElement>(
        `input[type="radio"][name="${CSS.escape(element.name)}"]`
      ),
      // Disabled radios are excluded from `FOCUSABLE` already, but they must
      // also be kept out of *this* election: letting one win it means every
      // enabled sibling answers false and the whole group leaves the tab order,
      // where a browser would simply make the first enabled radio the stop.
    ].filter(radio => !radio.disabled && isVisible(radio));
    const checked = radios.find(r => r.checked);
    if (checked) return checked === element;
    return radios[0] === element;
  }
  return isVisible(element);
}

/**
 * Every tabbable descendant, in tab order.
 *
 * Light DOM only — `querySelectorAll` does not descend into shadow roots, so a
 * consumer's web component counts as one stop rather than however many its
 * shadow content holds. `contains` below deliberately *does* cross shadow
 * boundaries, because "did this click land inside the layer" has to be true for
 * shadow content; the two answer different questions.
 *
 * Positive `tabindex` values sort ahead of everything in document order, which
 * is what the specification says and what screen readers follow — even though
 * using them is a mistake. Honouring it here means a consumer's existing markup
 * behaves inside a trap exactly as it does outside one.
 */
export function getTabbables(root: ParentNode): HTMLElement[] {
  const candidates = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(isTabbable);
  const positive = candidates.filter(el => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
  const natural = candidates.filter(el => el.tabIndex === 0);
  return [...positive, ...natural];
}

/** The deepest active element, following into open shadow roots. */
export function activeElement(doc: Document = document): HTMLElement | null {
  let active = doc.activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement as HTMLElement;
  }
  return active;
}

/** Whether `node` is inside `container`, crossing open shadow boundaries. */
export function contains(container: Node, node: Node | null): boolean {
  if (!node) return false;
  if (container.contains(node)) return true;
  // A node inside a shadow root is not `contains`ed by anything outside it, so
  // walk out through hosts. Without this, a click inside a consumer's web
  // component reads as "outside" and dismisses the layer under it.
  let current: Node | null = node;
  while (current) {
    if (current === container) return true;
    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }
  return false;
}
