/**
 * Utility functions for calculating element positions
 * Used for tooltips, popovers, dropdowns, etc.
 */

/**
 * Check if an element would be clipped if positioned at the given coordinates
 * Returns adjusted coordinates to keep the element within the viewport
 */
export const adjustPositionToViewport = (
  left: number,
  top: number,
  width: number,
  height: number,
  padding = 10
): { left: number; top: number } => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Adjust horizontal position
  if (left < padding) {
    left = padding;
  } else if (left + width > viewportWidth - padding) {
    left = viewportWidth - width - padding;
  }

  // Adjust vertical position
  if (top < padding) {
    top = padding;
  } else if (top + height > viewportHeight - padding) {
    top = viewportHeight - height - padding;
  }

  return { left, top };
};

/**
 * Calculate the position for a floating element (tooltip, popover, etc.)
 * based on the reference element and the desired placement
 */
export const calculatePosition = (
  referenceRect: DOMRect,
  floatingRect: DOMRect,
  placement: 'top' | 'right' | 'bottom' | 'left',
  gap = 8
): {
  floatingPosition: { top: number; left: number };
  arrowPosition: { top: number; left: number };
} => {
  let top = 0;
  let left = 0;
  let arrowTop = 0;
  let arrowLeft = 0;

  // Calculate position based on placement
  switch (placement) {
    case 'top':
      top = referenceRect.top - floatingRect.height - gap;
      left = referenceRect.left + referenceRect.width / 2 - floatingRect.width / 2;
      arrowTop = floatingRect.height;
      arrowLeft = floatingRect.width / 2;
      break;

    case 'bottom':
      top = referenceRect.bottom + gap;
      left = referenceRect.left + referenceRect.width / 2 - floatingRect.width / 2;
      arrowTop = -4;
      arrowLeft = floatingRect.width / 2;
      break;

    case 'left':
      top = referenceRect.top + referenceRect.height / 2 - floatingRect.height / 2;
      left = referenceRect.left - floatingRect.width - gap;
      arrowTop = floatingRect.height / 2;
      arrowLeft = floatingRect.width;
      break;

    case 'right':
      top = referenceRect.top + referenceRect.height / 2 - floatingRect.height / 2;
      left = referenceRect.right + gap;
      arrowTop = floatingRect.height / 2;
      arrowLeft = -4;
      break;
  }

  // Adjust position to keep within viewport
  const adjustedPosition = adjustPositionToViewport(
    left,
    top,
    floatingRect.width,
    floatingRect.height
  );

  // Adjust arrow position if the floating element position was adjusted
  if (placement === 'top' || placement === 'bottom') {
    arrowLeft += left - adjustedPosition.left;
  } else if (placement === 'left' || placement === 'right') {
    arrowTop += top - adjustedPosition.top;
  }

  return {
    floatingPosition: adjustedPosition,
    arrowPosition: { top: arrowTop, left: arrowLeft },
  };
};
