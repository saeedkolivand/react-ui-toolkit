import { ChangeDetectionStrategy, Component, input } from "@angular/core";

interface Breakpoint {
  span?: number;
  offset?: number;
}

@Component({
  selector: "ck-col",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "col",
    "data-part": "root",
    "[attr.data-span]": "span() ?? null",
    "[attr.data-offset]": "offset() ?? null",
    "[attr.data-span-sm]": "sm()?.span ?? null",
    "[attr.data-offset-sm]": "sm()?.offset ?? null",
    "[attr.data-span-md]": "md()?.span ?? null",
    "[attr.data-offset-md]": "md()?.offset ?? null",
    "[attr.data-span-lg]": "lg()?.span ?? null",
    "[attr.data-offset-lg]": "lg()?.offset ?? null",
    "[attr.data-span-xl]": "xl()?.span ?? null",
    "[attr.data-offset-xl]": "xl()?.offset ?? null",
    "[attr.data-order]": "isNamedOrder() ? order() : null",
    // `order` is unbounded, so it stays an inline custom property. Spans and
    // offsets are enumerable and therefore static CSS.
    "[style.--ck-col-order]": "isNamedOrder() ? null : (order() ?? null)",
  },
  template: `<ng-content />`,
})
export class CkCol {
  readonly span = input<number>();
  readonly offset = input<number>();
  readonly sm = input<Breakpoint>();
  readonly md = input<Breakpoint>();
  readonly lg = input<Breakpoint>();
  readonly xl = input<Breakpoint>();
  readonly order = input<number | "first" | "last">();

  protected isNamedOrder() {
    return typeof this.order() === "string";
  }
}
