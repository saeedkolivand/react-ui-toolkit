import React from "react";
import { twMerge } from "tailwind-merge";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction of the divider
   * @default 'horizontal'
   */
  type?: "horizontal" | "vertical";
  /**
   * The orientation of the divider text
   * @default 'center'
   */
  orientation?: "left" | "right" | "center";
  /**
   * Whether the divider is dashed
   * @default false
   */
  dashed?: boolean;
  /**
   * The text to show in the divider
   */
  children?: React.ReactNode;
  /**
   * Ref forwarded to the underlying element. React 19 passes `ref` as a
   * regular prop, so no forwardRef wrapper is needed.
   */
  ref?: React.Ref<HTMLDivElement>;
}

export const Divider = ({
  type = "horizontal",
  orientation = "center",
  dashed = false,
  children,
  className,
  ref,
  ...props
}: DividerProps) => {
  const baseClasses = twMerge(
    "relative",
    type === "horizontal" ? "w-full h-px" : "h-full w-px border-l-2 mx-2",
    dashed ? "border-dashed" : "border-solid",
    "border-gray-300",
    className
  );

  const horizontalLineClasses = twMerge(
    "flex-1 h-px border-t-2",
    dashed ? "border-dashed" : "border-solid",
    "border-gray-300"
  );

  if (type === "horizontal") {
    return (
      <div
        ref={ref}
        data-testid="divider"
        {...props}
        className={`${baseClasses} flex items-center w-full my-4`}
      >
        <div
          data-testid="divider-line"
          className={twMerge(
            horizontalLineClasses,
            orientation === "left" ? "w-1/4" : orientation === "right" ? "w-3/4" : "w-full"
          )}
        />
        {children && (
          <span className="px-4 text-gray-500 text-sm whitespace-nowrap">{children}</span>
        )}
        {children && (
          <div
            data-testid="divider-line"
            className={twMerge(
              horizontalLineClasses,
              orientation === "left" ? "w-3/4" : orientation === "right" ? "w-1/4" : "w-full"
            )}
          />
        )}
      </div>
    );
  }

  return <div ref={ref} data-testid="divider" className={baseClasses} {...props} />;
};
