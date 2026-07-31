"use client";

/**
 * `ConfigProvider` — theme, locale and direction for everything beneath it.
 *
 * The theme arrives as a compiled CSS string from `createTheme()`, so this
 * renders a `<style>` and nothing else. There is no style engine here, no class
 * generation and no per-instance work: the entire cost of theming is one text
 * node, whatever the tree below looks like.
 *
 * Locale and direction do go through context, because components read them at
 * render time — a Table needs its empty-state string, a Tooltip needs to know
 * which way `topLeft` points.
 */

import { createContext, use, useId, useMemo, type ReactNode } from "react";
import type { CompiledTheme } from "@crosskit-ui/core";
import { defaultLocale, type Locale } from "../locale/en-US";

export type Direction = "ltr" | "rtl";

export interface ConfigContextValue {
  locale: Locale;
  direction: Direction;
  /**
   * Whether a provider exists above this point.
   *
   * An explicit marker rather than inferring it from `themeScope`: only a
   * provider that *scoped* sets that, and the outermost never scopes — so
   * inferring made every provider believe it was outermost, and a nested theme
   * wrote to `:root` and repainted the whole document.
   */
  hasProvider: boolean;
  /** Present when a nested provider scoped its theme; components rarely need it. */
  themeScope?: string;
}

const ConfigContext = createContext<ConfigContextValue>({
  locale: defaultLocale,
  direction: "ltr",
  hasProvider: false,
});

export const useConfig = (): ConfigContextValue => use(ConfigContext);

export interface ConfigProviderProps {
  theme?: CompiledTheme;
  locale?: Locale;
  direction?: Direction;
  children?: ReactNode;
}

export function ConfigProvider({ theme, locale, direction, children }: ConfigProviderProps) {
  const parent = use(ConfigContext);
  const scopeId = useId();

  // Only a *nested* provider scopes its theme. The outermost writes to `:root`,
  // so a portaled overlay — a sibling of the provider rather than a descendant,
  // per rule 6 — still gets the tokens. Scoping the top level leaves every
  // modal, drawer, tooltip and toast in the app unthemed.
  //
  // `direction` deliberately plays no part in this. Including it meant a
  // top-level provider that merely set `dir="rtl"` scoped its theme to a wrapper
  // div, producing exactly the unthemed-overlay failure described above for
  // every RTL app.
  const scope = theme && parent.hasProvider ? scopeId.replace(/:/g, "") : undefined;

  const value = useMemo<ConfigContextValue>(
    () => ({
      // Inherited rather than reset, so a provider that only sets `direction`
      // keeps the locale from above it.
      locale: locale ?? parent.locale,
      direction: direction ?? parent.direction,
      hasProvider: true,
      themeScope: scope ?? parent.themeScope,
    }),
    [locale, direction, scope, parent]
  );

  const css = useMemo(() => {
    if (!theme) return undefined;
    if (!scope) return theme.css;
    // Every `:root`, not the first.
    //
    // `String.replace` with a string pattern replaces one occurrence, and a
    // theme emits more than one block once `components` is used: a
    // `[data-scope="button"]` token block and compiled style overrides sit
    // alongside the `:root` one. Rewriting only the first left a *scoped*
    // provider applying its component tokens document-wide.
    //
    // The tidier route is `createTheme({ scope })`, but the theme arrives here
    // already compiled and recompiling on every render costs more than a
    // string scan. Component blocks are prefixed rather than replaced, so they
    // stay scoped to both the theme and the component.
    return theme.css
      .replaceAll(":root {", `[data-ck-theme="${scope}"] {`)
      .replaceAll(/^(\[data-scope=)/gm, `[data-ck-theme="${scope}"] $1`);
  }, [theme, scope]);

  const content = (
    <ConfigContext value={value}>
      {css !== undefined && <style data-ck-theme-style="">{css}</style>}
      {children}
    </ConfigContext>
  );

  // A wrapper element only when there is something to put on it. An unconditional
  // <div> would break every layout that expects its children to be direct
  // descendants — a flex row, a grid, a <tbody>.
  if (scope === undefined && direction === undefined) return content;

  return (
    <div data-ck-theme={scope} dir={direction} style={{ display: "contents" }}>
      {content}
    </div>
  );
}
