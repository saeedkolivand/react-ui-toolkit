<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    spacing?: number;
    wrap?: boolean;
    reverse?: boolean;
    children?: Snippet;
  }

  let {
    justify,
    align,
    spacing,
    wrap = true,
    reverse = false,
    children,
    class: klass,
    style,
    ...rest
  }: Props = $props();

  // Inline custom property, not a class: v0's `gap-${n}` was a dynamic Tailwind
  // class that produced nothing in a consumer's build.
  const styleAttr = $derived(
    spacing == null ? style : `${style ? style + ";" : ""}--ck-row-spacing:${spacing}`,
  );
</script>

<div
  data-scope="row"
  data-part="root"
  data-justify={justify}
  data-align={align}
  data-wrap={wrap ? undefined : "false"}
  data-reverse={dataAttr(reverse)}
  class={klass}
  style={styleAttr}
  {...rest}
>
  {@render children?.()}
</div>
