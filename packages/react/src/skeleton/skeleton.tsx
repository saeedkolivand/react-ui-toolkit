// Server-safe: pure markup, no hooks, no handlers.
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr } from "@crosskit-ui/core";

export type SkeletonSize = "small" | "default" | "large";
export type SkeletonShape = "circle" | "square" | "round" | "default";

export interface SkeletonTitleProps {
  width?: number | string;
}

export interface SkeletonParagraphProps {
  rows?: number;
  /** One width for every row, or a list applied row by row. */
  width?: number | string | Array<number | string>;
}

// `title` is omitted from the native attributes: the DOM's own `title` is a
// string (the browser tooltip), and ours is a switch with an options object.
export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Animate the shimmer. Off by default, so the placeholder is still. */
  active?: boolean;
  /**
   * Show the placeholder rather than `children`.
   *
   * Leaving it off also shows the placeholder, so `<Skeleton/>` alone is a
   * placeholder and `<Skeleton loading={busy}>…</Skeleton>` is a switch.
   *
   * Once it is `false` the children are returned bare — no wrapper, and so no
   * `className`, `id`, `ref` or spread attribute either. That is deliberate:
   * keeping them would mean a box that appears the moment loading ends and
   * changes the layout underneath it, which is worse than the thing it fixes.
   * Put the class on something that is there in both states.
   */
  loading?: boolean;
  avatar?: boolean | SkeletonAvatarProps;
  title?: boolean | SkeletonTitleProps;
  paragraph?: boolean | SkeletonParagraphProps;
  /** Round the ends of the title and paragraph rows. */
  round?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const len = (value: number | string | undefined): string | undefined =>
  value == null ? undefined : typeof value === "number" ? `${value}px` : value;

/** The last row is short unless told otherwise — that is what reads as prose. */
const rowWidth = (
  spec: SkeletonParagraphProps["width"],
  index: number,
  rows: number
): string | undefined => {
  if (Array.isArray(spec)) return len(spec[index]);
  if (spec != null) return len(spec);
  return index === rows - 1 ? "61%" : undefined;
};

export function Skeleton({
  active = false,
  loading,
  avatar = false,
  title = true,
  paragraph = true,
  round = false,
  children,
  className,
  ref,
  ...rest
}: SkeletonProps) {
  // `loading` omitted means "placeholder", so the zero-prop form renders one.
  // Reading it as merely falsy would make `<Skeleton/>` render nothing at all.
  if (loading === false) return <>{children}</>;

  const avatarProps = avatar === true ? {} : avatar === false ? undefined : avatar;
  const titleProps = title === true ? {} : title === false ? undefined : title;
  const paragraphProps = paragraph === true ? {} : paragraph === false ? undefined : paragraph;
  const rows = paragraphProps?.rows ?? 3;

  return (
    <div
      ref={ref}
      data-scope="skeleton"
      data-part="root"
      data-active={dataAttr(active)}
      data-round={dataAttr(round)}
      // The placeholder has no text, so there is nothing to announce — but a
      // screen reader still needs to know this region is not its final content.
      // `aria-busy` says exactly that and says it without speaking.
      aria-busy="true"
      className={className}
      {...rest}
    >
      {avatarProps && <SkeletonAvatar active={active} {...avatarProps} />}
      {/* Gated, so a skeleton that is only an avatar does not carry an empty
          box. It costs nothing at the default `display: flex`, where the part
          is `flex: 1` inside a root that fills its parent either way — but a
          consumer override to `inline-flex` makes it 16px of gap around
          nothing, and consumer overrides are a supported story here. */}
      {(titleProps || paragraphProps) && (
        <div data-part="content">
          {titleProps && <div data-part="title" style={{ inlineSize: len(titleProps.width) }} />}
          {paragraphProps && (
            <ul data-part="paragraph">
              {Array.from({ length: rows }, (_, index) => (
                <li
                  key={index}
                  data-part="row"
                  style={{ inlineSize: rowWidth(paragraphProps.width, index, rows) }}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

interface BlockOwn {
  active?: boolean;
  /** A number is a length in pixels; a keyword resolves in CSS. */
  size?: SkeletonSize | number;
  shape?: SkeletonShape;
  /** Fill the inline axis rather than sizing to the shape's own width. */
  block?: boolean;
}

type BlockProps = BlockOwn &
  Omit<HTMLAttributes<HTMLDivElement>, "children"> & { ref?: Ref<HTMLDivElement> };

/**
 * The one element behind Avatar, Button, Input and Image.
 *
 * They differ only in their default shape and in whether a numeric `size` is an
 * edge length or a height, so the shimmer, the active state and the round
 * corners are defined once and keyed on `data-part`.
 */
function Block({
  part,
  square = false,
  active = false,
  size = "default",
  shape,
  block = false,
  style,
  className,
  ref,
  ...rest
}: BlockProps & { part: string; square?: boolean }) {
  const numeric = typeof size === "number";
  return (
    <div
      ref={ref}
      data-scope="skeleton"
      data-part={part}
      data-active={dataAttr(active)}
      data-size={numeric ? undefined : size}
      data-shape={shape}
      data-block={dataAttr(block)}
      className={className}
      style={
        numeric
          ? { ...style, blockSize: `${size}px`, ...(square && { inlineSize: `${size}px` }) }
          : style
      }
      {...rest}
    />
  );
}

export interface SkeletonAvatarProps extends Omit<BlockProps, "shape" | "block"> {
  shape?: "circle" | "square";
}

export function SkeletonAvatar({ shape = "circle", ...rest }: SkeletonAvatarProps) {
  return <Block part="avatar" shape={shape} square {...rest} />;
}

export function SkeletonButton({ shape = "default", ...rest }: BlockProps) {
  return <Block part="button" shape={shape} {...rest} />;
}

export function SkeletonInput(props: Omit<BlockProps, "shape">) {
  return <Block part="input" {...props} />;
}

export function SkeletonImage(props: Omit<BlockProps, "shape" | "size">) {
  return <Block part="image" {...props} />;
}

export interface SkeletonNodeProps extends Omit<BlockProps, "shape" | "size"> {
  children?: ReactNode;
}

/** A placeholder you fill yourself — an icon outline, a chart frame, anything. */
export function SkeletonNode({
  active = false,
  block = false,
  children,
  className,
  style,
  ref,
  ...rest
}: SkeletonNodeProps) {
  return (
    <div
      ref={ref}
      data-scope="skeleton"
      data-part="node"
      data-active={dataAttr(active)}
      data-block={dataAttr(block)}
      className={className}
      style={style as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}

Skeleton.Avatar = SkeletonAvatar;
Skeleton.Button = SkeletonButton;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Node = SkeletonNode;
