export type Size = "sm" | "md" | "lg";
export type IconSize = Size | "xl";
export type ModalSize = Size | "xl" | "full";

export type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "error"
  | "warning"
  | "info";

export type Status = "success" | "error" | "warning" | "info";

/** Unifies the old Input `"outline"` / Textarea `"outlined"` split (bug 0.9). */
export type FieldVariant = "default" | "filled" | "outline";

export type Orientation = "horizontal" | "vertical";
export type Side = "top" | "right" | "bottom" | "left";
export type Placement = Side | `${Side}-start` | `${Side}-end`;

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export type TabsVariant = "line" | "enclosed" | "soft-rounded" | "solid-rounded";
export type Density = "small" | "middle" | "large";
export type ToastPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";
