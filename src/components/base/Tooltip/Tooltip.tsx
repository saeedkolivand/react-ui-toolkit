import React, { useState, useRef, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";

export type TooltipPlacement =
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

export type TooltipTrigger = "hover" | "focus" | "click" | "contextMenu";

export interface TooltipProps {
  /** The content to display inside the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** The preferred placement of the tooltip */
  placement?: TooltipPlacement;
  /** How the tooltip is triggered */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** Whether the tooltip is initially visible */
  defaultVisible?: boolean;
  /** Delay before showing the tooltip (in ms) */
  showDelay?: number;
  /** Delay before hiding the tooltip (in ms) */
  hideDelay?: number;
  /** Custom CSS class for the tooltip */
  className?: string;
  /** CSS class for the tooltip content */
  overlayClassName?: string;
  /** CSS class for the tooltip inner content */
  overlayInnerClassName?: string;
  /** CSS style for the tooltip */
  overlayStyle?: React.CSSProperties;
  /** CSS style for the tooltip inner content */
  overlayInnerStyle?: React.CSSProperties;
  /** Width of the tooltip - 'auto' or specific pixel value */
  width?: "auto" | number;
  /** Max width of the tooltip in pixels */
  maxWidth?: number;
  /** Whether the tooltip should have an arrow */
  arrow?: boolean;
  /** Whether the tooltip is visible (controlled mode) */
  visible?: boolean;
  /** Callback when visibility changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Whether to destroy tooltip when hidden */
  destroyTooltipOnHide?: boolean;
  /** Whether the tooltip can be used with disabled elements */
  allowHoverOnDisabled?: boolean;
  /** Z-index of the tooltip */
  zIndex?: number;
  /** HTML title of the tooltip */
  title?: string;
  /** Color of the tooltip (predefined or custom) */
  color?: string;
}

// Portal component for rendering tooltip outside of parent hierarchy
const TooltipPortal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create portal container if it doesn't exist
    const portalId = "tooltip-portal-container";
    let portalContainer = document.getElementById(portalId) as HTMLDivElement;

    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.id = portalId;
      portalContainer.style.position = "fixed";
      portalContainer.style.zIndex = "1050"; // Match Ant Design's default z-index
      portalContainer.style.top = "0";
      portalContainer.style.left = "0";
      portalContainer.style.width = "0";
      portalContainer.style.height = "0";
      document.body.appendChild(portalContainer);
    }

    portalRef.current = portalContainer;
    setMounted(true);

    return () => {
      // Clean up only if empty
      if (portalContainer.childNodes.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);

  return mounted && portalRef.current ? ReactDOM.createPortal(children, portalRef.current) : null;
};

/**
 * Tooltip component that shows additional information when hovering or clicking an element
 * Follows Ant Design's Tooltip implementation
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  trigger = "hover",
  defaultVisible = false,
  showDelay = 50, // Ant Design uses 50ms by default
  hideDelay = 50, // Ant Design uses 50ms by default
  className,
  overlayClassName,
  overlayInnerClassName,
  overlayStyle,
  overlayInnerStyle,
  width = "auto",
  maxWidth = "auto" === width ? undefined : 250,
  arrow = true,
  visible: controlledVisible,
  onVisibleChange,
  destroyTooltipOnHide = false,
  zIndex = 1050,
  color,
  title, // For compatibility with antd
}) => {
  // Use title as content if provided (for antd compatibility)
  const tooltipContent = content || title;

  // Normalize trigger to array
  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  // State for tooltip visibility
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  // References
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Use controlled visible prop if provided
  const visible = controlledVisible !== undefined ? controlledVisible : isVisible;

  // Handle visibility change
  const updateVisibility = (newVisible: boolean) => {
    if (controlledVisible === undefined) {
      setIsVisible(newVisible);
    }
    onVisibleChange?.(newVisible);
  };

  // Calculate the position of the tooltip
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const gap = 8; // Gap between trigger and tooltip

    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    // Calculate position based on placement
    switch (placement) {
      // Basic placements
      case "top":
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        arrowTop = tooltipRect.height;
        arrowLeft = tooltipRect.width / 2;
        break;

      case "bottom":
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        arrowTop = -4;
        arrowLeft = tooltipRect.width / 2;
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        arrowTop = tooltipRect.height / 2;
        arrowLeft = tooltipRect.width;
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap;
        arrowTop = tooltipRect.height / 2;
        arrowLeft = -4;
        break;

      // Advanced placements
      case "topLeft":
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left;
        arrowTop = tooltipRect.height;
        arrowLeft = Math.min(triggerRect.width / 2, 20);
        break;

      case "topRight":
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.right - tooltipRect.width;
        arrowTop = tooltipRect.height;
        arrowLeft = tooltipRect.width - Math.min(triggerRect.width / 2, 20);
        break;

      case "bottomLeft":
        top = triggerRect.bottom + gap;
        left = triggerRect.left;
        arrowTop = -4;
        arrowLeft = Math.min(triggerRect.width / 2, 20);
        break;

      case "bottomRight":
        top = triggerRect.bottom + gap;
        left = triggerRect.right - tooltipRect.width;
        arrowTop = -4;
        arrowLeft = tooltipRect.width - Math.min(triggerRect.width / 2, 20);
        break;

      case "leftTop":
        top = triggerRect.top;
        left = triggerRect.left - tooltipRect.width - gap;
        arrowTop = Math.min(triggerRect.height / 2, 10);
        arrowLeft = tooltipRect.width;
        break;

      case "leftBottom":
        top = triggerRect.bottom - tooltipRect.height;
        left = triggerRect.left - tooltipRect.width - gap;
        arrowTop = tooltipRect.height - Math.min(triggerRect.height / 2, 10);
        arrowLeft = tooltipRect.width;
        break;

      case "rightTop":
        top = triggerRect.top;
        left = triggerRect.right + gap;
        arrowTop = Math.min(triggerRect.height / 2, 10);
        arrowLeft = -4;
        break;

      case "rightBottom":
        top = triggerRect.bottom - tooltipRect.height;
        left = triggerRect.right + gap;
        arrowTop = tooltipRect.height - Math.min(triggerRect.height / 2, 10);
        arrowLeft = -4;
        break;
    }

    // Ensure the tooltip stays within the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left < 10) {
      const offset = left - 10;
      left = 10;
      // Adjust arrow position accordingly
      if (placement.includes("top") || placement.includes("bottom")) {
        arrowLeft += offset;
      }
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      const offset = left + tooltipRect.width - (viewportWidth - 10);
      left -= offset;
      // Adjust arrow position accordingly
      if (placement.includes("top") || placement.includes("bottom")) {
        arrowLeft += offset;
      }
    }

    // Adjust vertical position if needed
    if (top < 10) {
      const offset = top - 10;
      top = 10;
      // Adjust arrow position accordingly
      if (placement.includes("left") || placement.includes("right")) {
        arrowTop += offset;
      }
    } else if (top + tooltipRect.height > viewportHeight - 10) {
      const offset = top + tooltipRect.height - (viewportHeight - 10);
      top -= offset;
      // Adjust arrow position accordingly
      if (placement.includes("left") || placement.includes("right")) {
        arrowTop += offset;
      }
    }

    setTooltipPosition({ top, left });
    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  // Show/hide handlers
  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    if (!showTimeoutRef.current) {
      showTimeoutRef.current = setTimeout(() => {
        updateVisibility(true);
        showTimeoutRef.current = undefined;
      }, showDelay);
    }
  };

  const hideTooltip = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    if (!hideTimeoutRef.current) {
      hideTimeoutRef.current = setTimeout(() => {
        updateVisibility(false);
        hideTimeoutRef.current = undefined;
      }, hideDelay);
    }
  };

  // Update position when tooltip visibility changes
  useEffect(() => {
    if (visible) {
      // Need a small delay to ensure the tooltip is rendered before measuring
      const timer = setTimeout(() => {
        calculatePosition();
      }, 0);

      // Recalculate on resize and scroll
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition, true); // Use capture phase

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculatePosition);
        window.removeEventListener("scroll", calculatePosition, true);
      };
    }
  }, [visible, placement]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Build event handlers based on trigger type
  const getEventHandlers = () => {
    const handlers: Record<string, any> = {};

    if (triggers.includes("hover")) {
      handlers.onMouseEnter = showTooltip;
      handlers.onMouseLeave = hideTooltip;
    }

    if (triggers.includes("focus")) {
      handlers.onFocus = showTooltip;
      handlers.onBlur = hideTooltip;
    }

    if (triggers.includes("click")) {
      handlers.onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (visible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      };
    }

    if (triggers.includes("contextMenu")) {
      handlers.onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (visible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      };
    }

    return handlers;
  };

  // Get arrow class names based on placement
  const getArrowClassNames = () => {
    const baseClasses = "absolute w-2 h-2";

    switch (placement) {
      case "top":
      case "topLeft":
      case "topRight":
        return `${baseClasses} rotate-[-135deg] bottom-[-5px]`;

      case "bottom":
      case "bottomLeft":
      case "bottomRight":
        return `${baseClasses} rotate-45 top-[-5px]`;

      case "left":
      case "leftTop":
      case "leftBottom":
        return `${baseClasses} rotate-[-45deg] right-[-5px]`;

      case "right":
      case "rightTop":
      case "rightBottom":
        return `${baseClasses} rotate-[135deg] left-[-5px]`;

      default:
        return baseClasses;
    }
  };

  // Get background color based on prop
  const getBackgroundColor = () => {
    if (!color) return undefined;

    // Check if it's a predefined color
    switch (color) {
      case "pink":
        return "#eb2f96";
      case "red":
        return "#f5222d";
      case "yellow":
        return "#faad14";
      case "orange":
        return "#fa8c16";
      case "cyan":
        return "#13c2c2";
      case "green":
        return "#52c41a";
      case "blue":
        return "#1890ff";
      case "purple":
        return "#722ed1";
      case "geekblue":
        return "#2f54eb";
      case "magenta":
        return "#eb2f96";
      case "volcano":
        return "#fa541c";
      case "gold":
        return "#faad14";
      case "lime":
        return "#a0d911";
      default:
        return color; // Use as custom color
    }
  };

  // Wrap children in a span to handle events correctly
  const renderTrigger = () => {
    const eventHandlers = getEventHandlers();

    // Handle special case for disabled elements
    if (
      React.isValidElement(children) &&
      (children.props.disabled || (children.type === "button" && children.props.disabled))
    ) {
      // If children is disabled, we need to wrap it in a span to trigger events
      return (
        <span ref={triggerRef} {...eventHandlers} className="inline-block">
          {children}
        </span>
      );
    }

    // Otherwise, clone the element and attach events
    return React.cloneElement(React.isValidElement(children) ? children : <span>{children}</span>, {
      ref: triggerRef,
      ...eventHandlers,
    });
  };

  // Don't render if there's no content
  if (!tooltipContent) {
    return <>{children}</>;
  }

  return (
    <>
      {renderTrigger()}

      {(visible || !destroyTooltipOnHide) && (
        <TooltipPortal>
          <div
            ref={tooltipRef}
            className={cn("absolute z-[1050] pointer-events-none", overlayClassName)}
            style={{
              ...overlayStyle,
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              zIndex: zIndex,
              visibility: visible ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
            }}
          >
            <AnimatePresence>
              {visible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={cn(
                    "py-1 px-2 rounded-sm shadow-md text-white text-sm border border-gray-200 inline-block",
                    overlayInnerClassName,
                    { "bg-gray-800": !color }
                  )}
                  style={{
                    ...overlayInnerStyle,
                    width: width === "auto" ? "auto" : `${width}px`,
                    maxWidth: maxWidth !== undefined ? `${maxWidth}px` : undefined,
                    whiteSpace: width === "auto" ? "nowrap" : "normal",
                    backgroundColor: getBackgroundColor() || (color ? undefined : "#1f2937"), // Explicit gray-800 value
                    borderColor: "rgba(229, 231, 235, 0.8)", // More subtle border
                  }}
                >
                  {tooltipContent}

                  {arrow && (
                    <div
                      className={getArrowClassNames()}
                      style={{
                        top: `${arrowPosition.top}px`,
                        left: `${arrowPosition.left}px`,
                        backgroundColor: getBackgroundColor() || (color ? undefined : "#1f2937"), // Use gray-800 default if no color
                        boxShadow: "1px 1px 0 0 rgba(0, 0, 0, 0.05)",
                        border: "1px solid rgba(229, 231, 235, 0.8)", // Gray-200 with opacity
                        borderRight: "none",
                        borderBottom: "none",
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TooltipPortal>
      )}
    </>
  );
};
