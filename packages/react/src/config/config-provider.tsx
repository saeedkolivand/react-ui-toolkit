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
  /** Present when a nested provider scoped its theme; components rarely need it. */
  themeScope?: string;
}

const ConfigContext = createContext<ConfigContextValue>({
  locale: defaultLocale,
  direction: "ltr",
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
  const generatedScope = useId();

  // Only a *nested* provider scopes its theme. The outermost one writes to
  // `:root` so a portaled overlay — which is a sibling of the provider, not a
  // descendant — still gets the tokens. Scoping the top level would leave every
  // modal in the app unthemed, which is the failure this ordering avoids.
  const nested = parent.themeScope !== undefined || direction !== undefined;
  const scope = theme && nested ? generatedScope.replace(/:/g, "") : undefined;

  const value = useMemo<ConfigContextValue>(
    () => ({
      // Inherited rather than reset, so a provider that only sets `direction`
      // keeps the locale from above it.
      locale: locale ?? parent.locale,
      direction: direction ?? parent.direction,
      themeScope: scope ?? parent.themeScope,
    }),
    [locale, direction, scope, parent]
  );

  const css = useMemo(() => {
    if (!theme) return undefined;
    if (!scope) return theme.css;
    // `createTheme({ scope })` would be the tidier route, but the theme object
    // is already compiled by the time it arrives here. Rewriting the one
    // selector it emits is cheaper than recompiling the whole thing on render.
    return theme.css.replace(":root {", `[data-ck-theme="${scope}"] {`);
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
