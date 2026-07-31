/**
 * Locking body scroll while an overlay is open.
 *
 * Reference-counted, because two overlays open at once must not each restore
 * the original styles on close — the first to close would unlock the page while
 * the second is still up.
 *
 * `overflow: hidden` alone is not enough on iOS Safari, which scrolls the body
 * anyway. `position: fixed` with the scroll offset held in `top` is the
 * standard workaround, and the offset has to be restored on unlock or the page
 * jumps to the top every time a dialog closes.
 */

interface Locked {
  count: number;
  scrollY: number;
  style: {
    overflow: string;
    position: string;
    top: string;
    width: string;
    paddingRight: string;
  };
}

let locked: Locked | null = null;

/**
 * Width of the classic scrollbar, so removing it does not shift the page.
 *
 * Zero on overlay-scrollbar platforms, which is correct — nothing to
 * compensate for there.
 */
const scrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

export function lockScroll(): () => void {
  if (locked) {
    locked.count++;
  } else {
    const body = document.body;
    const { overflow, position, top, width, paddingRight } = body.style;
    const scrollY = window.scrollY;
    const gap = scrollbarWidth();

    locked = { count: 1, scrollY, style: { overflow, position, top, width, paddingRight } };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    // `position: fixed` collapses the body to its content width; pinning it
    // stops a centred layout jumping sideways as the lock engages.
    body.style.width = "100%";
    if (gap > 0) {
      const existing = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${existing + gap}px`;
    }
  }

  let released = false;
  return () => {
    // Idempotent: an adapter that cleans up twice — a double unmount, a strict
    // mode remount — must not decrement the count twice and unlock early.
    if (released || !locked) return;
    released = true;

    if (--locked.count > 0) return;

    const body = document.body;
    Object.assign(body.style, locked.style);
    // Restore before clearing state; `scrollTo` is a no-op while the body is
    // still fixed.
    window.scrollTo({ top: locked.scrollY, behavior: "instant" });
    locked = null;
  };
}

/** How many locks are held. For tests, and for asserting balanced cleanup. */
export const scrollLockDepth = () => locked?.count ?? 0;
