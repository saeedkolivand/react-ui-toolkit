// NO "use client": a Button is server-safe. A consumer's own onClick is THEIR
// client boundary, not ours — a directive here would needlessly pull every
// consuming tree into the client bundle.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr } from "@crosskit-ui/core";

export type ButtonType = "default" | "primary" | "dashed" | "text" | "link";
export type ButtonSize = "small" | "middle" | "large";
export type ButtonShape = "default" | "circle" | "round";

interface CommonProps {
  /** Visual weight. `type`, not `variant` — see `htmlType` below for the consequence. */
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Destructive styling, orthogonal to `type` so a text button can be dangerous too. */
  danger?: boolean;
  /** Transparent background for use over an image or colour. */
  ghost?: boolean;
  /** Fills its container's inline size. */
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children?: ReactNode;
  className?: string;
}

export interface ButtonProps
  extends
    CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "disabled"> {
  /**
   * The native `type` attribute.
   *
   * Named `htmlType` because `type` is taken by the visual variant above. This
   * is inherited rather than fixed: the API is mirrored deliberately, and
   * silently "improving" one prop name is worse than the inconsistency, because
   * it breaks the one guarantee the choice was made for — that pasted markup
   * works.
   *
   * Defaults to `"button"`. Leaving it unset makes a button inside a form
   * submit it, which is almost never what a component library's default should
   * be.
   */
  htmlType?: "button" | "submit" | "reset";
  href?: undefined;
  ref?: Ref<HTMLButtonElement>;
}

export interface LinkButtonProps
  extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "children"> {
  /** Renders an `<a>`. A button that navigates has to be a link, or it is unusable with a keyboard. */
  href: string;
  ref?: Ref<HTMLAnchorElement>;
}

/** Either form. What a consumer wrapping Button should accept. */
export type AnyButtonProps = ButtonProps | LinkButtonProps;

const isLink = (props: AnyButtonProps): props is LinkButtonProps =>
  typeof (props as LinkButtonProps).href === "string";

/**
 * The attributes and children both element types share.
 *
 * Computed once and spread into whichever element is rendered, so the two
 * branches cannot drift — a `data-*` added to one and forgotten on the other is
 * exactly the divergence the parity suite would catch a week later.
 */
function presentation(props: CommonProps) {
  const {
    type = "default",
    size = "middle",
    shape = "default",
    danger = false,
    ghost = false,
    block = false,
    loading = false,
    disabled = false,
    icon,
    iconPosition = "start",
    children,
    className,
  } = props;

  const shared = {
    "data-scope": "button",
    "data-part": "root",
    "data-type": type,
    "data-size": size,
    // Only when it is not the default, so the common case emits no attribute at
    // all and the stylesheet's base rule is what applies.
    "data-shape": shape === "default" ? undefined : shape,
    // Every boolean through `dataAttr`, which yields "" or undefined. Binding a
    // raw boolean renders data-loading="false", and "false" *matches*
    // [data-loading] in CSS — the wrong styles, silently.
    "data-danger": dataAttr(danger),
    "data-ghost": dataAttr(ghost),
    "data-block": dataAttr(block),
    "data-loading": dataAttr(loading),
    // Reflects the *effective* state, not just the prop. A loading button is
    // genuinely disabled in the DOM, so a stylesheet rule keyed on the
    // attribute would otherwise miss it while `:disabled` matched — the two
    // disagreeing is the sort of thing each of the other three adapters would
    // then re-decide differently.
    "data-disabled": dataAttr(disabled || loading),
    "data-icon-position": icon ? iconPosition : undefined,
    className,
  };

  const content = (
    <>
      {/* Before the icon, and always rendered while loading, so the spinner does
          not push the label sideways as it appears. */}
      {loading && <span data-part="spinner" aria-hidden="true" />}
      {iconPosition === "start" && icon && (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children !== undefined && children !== null && <span data-part="label">{children}</span>}
      {iconPosition === "end" && icon && (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  return { shared, content, inactive: disabled || loading, loading };
}

/** Keys `presentation` consumes, so neither branch leaks them onto the DOM. */
const PRESENTATION_KEYS = [
  "type",
  "size",
  "shape",
  "danger",
  "ghost",
  "block",
  "loading",
  "disabled",
  "icon",
  "iconPosition",
  "children",
  "className",
] as const;

const withoutPresentation = <T extends object>(
  props: T
): Omit<T, (typeof PRESENTATION_KEYS)[number]> => {
  const rest = { ...props } as Record<string, unknown>;
  for (const key of PRESENTATION_KEYS) delete rest[key];
  return rest as Omit<T, (typeof PRESENTATION_KEYS)[number]>;
};

function NativeButton(props: ButtonProps) {
  const { shared, content, inactive, loading } = presentation(props);
  const { htmlType = "button", ref, href: _href, ...rest } = withoutPresentation(props);

  return (
    <button
      ref={ref}
      type={htmlType}
      disabled={inactive}
      // `aria-busy` rather than relying on the disabled state alone: a screen
      // reader should say the control is working, not merely that it is
      // unavailable.
      aria-busy={loading ? "true" : undefined}
      {...shared}
      // rest LAST, so a consumer — and a composing component — can override
      // anything above.
      {...rest}
    >
      {content}
    </button>
  );
}

function LinkButton(props: LinkButtonProps) {
  const { shared, content, inactive } = presentation(props);
  const { href, ref, ...rest } = withoutPresentation(props);

  return (
    <a
      ref={ref}
      // Dropped rather than merely styled, so the link is genuinely not
      // activatable — by pointer, keyboard, or "open in new tab".
      href={inactive ? undefined : href}
      // An <a> has no `disabled`, so the state has to be exposed for assistive
      // technology some other way.
      aria-disabled={inactive ? "true" : undefined}
      // Deliberately NO role="button". It would override the implicit `link`
      // role, so a screen reader announces "button", the element drops out of
      // the links rotor, and the "this navigates" affordance is gone for exactly
      // the users the <a> was rendered for. Styling keys on data-scope, not the
      // role, so nothing is lost by leaving it native.
      {...shared}
      {...rest}
    >
      {content}
    </a>
  );
}

/**
 * Split rather than branching inside one function: destructuring a union's rest
 * leaves TypeScript widening every prop the two shapes disagree about, so
 * `htmlType` came out as `ButtonType | "button" | "submit" | "reset"`.
 */
export function Button(props: AnyButtonProps) {
  return isLink(props) ? <LinkButton {...props} /> : <NativeButton {...props} />;
}
