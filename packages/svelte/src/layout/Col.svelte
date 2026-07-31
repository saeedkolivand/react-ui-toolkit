<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Breakpoint {
    span?: number;
    offset?: number;
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    span?: number;
    offset?: number;
    sm?: Breakpoint;
    md?: Breakpoint;
    lg?: Breakpoint;
    xl?: Breakpoint;
    order?: number | "first" | "last";
    children?: Snippet;
  }

  let {
    span,
    offset,
    sm,
    md,
    lg,
    xl,
    order,
    children,
    class: klass,
    style,
    ...rest
  }: Props = $props();

  // `order` is unbounded, so it stays an inline custom property. Spans and
  // offsets are enumerable and therefore static CSS.
  const styleAttr = $derived(
    typeof order === "number" ? `${style ? style + ";" : ""}--ck-col-order:${order}` : style
  );
</script>

<div
  data-scope="col"
  data-part="root"
  data-span={span}
  data-offset={offset}
  data-span-sm={sm?.span}
  data-offset-sm={sm?.offset}
  data-span-md={md?.span}
  data-offset-md={md?.offset}
  data-span-lg={lg?.span}
  data-offset-lg={lg?.offset}
  data-span-xl={xl?.span}
  data-offset-xl={xl?.offset}
  data-order={typeof order === "string" ? order : undefined}
  class={klass}
  style={styleAttr}
  {...rest}
>
  {@render children?.()}
</div>
