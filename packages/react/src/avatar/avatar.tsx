"use client";

import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { dataAttr, type IconSize } from "@crosskit-ui/core";

export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  size?: IconSize;
  status?: AvatarStatus;
  /** A name, from which initials are derived. */
  initials?: string;
  squared?: boolean;
  bordered?: boolean;
  fallback?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

/** "Ada Lovelace" -> "AL"; a single word yields one letter. */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  alt = "",
  size = "md",
  status,
  initials,
  squared = false,
  bordered = false,
  fallback,
  className,
  ref,
  ...rest
}: AvatarProps) {
  // v0 had no loaded/error state, so a slow or broken image left a visible gap
  // where the fallback should have been.
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const showFallback = !src || state === "error";

  return (
    <span
      ref={ref}
      data-scope="avatar"
      data-part="root"
      data-size={size}
      data-squared={dataAttr(squared)}
      data-bordered={dataAttr(bordered)}
      className={className}
      {...rest}
    >
      {src && (
        <img
          data-part="image"
          data-state={state}
          src={src}
          alt={alt}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
        />
      )}
      {showFallback && (
        <span data-part="fallback">{fallback ?? (initials ? getInitials(initials) : null)}</span>
      )}
      {status && <span data-part="status" data-status={status} aria-label={status} />}
    </span>
  );
}
