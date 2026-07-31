import { booleanAttribute, ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

@Component({
  selector: "ck-container",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "container",
    "data-part": "root",
    "[attr.data-max-width]": "maxWidth() === 'none' ? null : maxWidth()",
    "[attr.data-padded]": "attr(padding())",
    "[attr.data-centered]": "attr(center())",
  },
  template: `<ng-content />`,
})
export class CkContainer {
  readonly maxWidth = input<"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none">("lg");
  readonly padding = input(true, { transform: booleanAttribute });
  readonly center = input(true, { transform: booleanAttribute });
  protected readonly attr = ckDataAttr;
}

@Component({
  selector: "ck-row",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "row",
    "data-part": "root",
    "[attr.data-justify]": "justify() ?? null",
    "[attr.data-align]": "align() ?? null",
    "[attr.data-wrap]": "wrap() ? null : 'false'",
    "[attr.data-reverse]": "attr(reverse())",
    // Inline custom property, not a class: v0's `gap-${n}` was a dynamic
    // Tailwind class that produced nothing in a consumer's build.
    "[style.--ck-row-spacing]": "spacing() ?? null",
  },
  template: `<ng-content />`,
})
export class CkRow {
  readonly justify = input<"start" | "center" | "end" | "between" | "around" | "evenly">();
  readonly align = input<"start" | "center" | "end" | "stretch" | "baseline">();
  readonly spacing = input<number>();
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly reverse = input(false, { transform: booleanAttribute });
  protected readonly attr = ckDataAttr;
}
