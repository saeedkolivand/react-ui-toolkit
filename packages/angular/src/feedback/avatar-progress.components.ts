import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import type { IconSize, Size, Status } from "@crosskit-ui/core";
import { ckDataAttr } from "@crosskit-ui/zag-angular";

@Component({
  selector: "ck-avatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "avatar",
    "data-part": "root",
    "[attr.data-size]": "size()",
    "[attr.data-squared]": "attr(squared())",
    "[attr.data-bordered]": "attr(bordered())",
  },
  template: `
    @if (src()) {
      <img
        data-part="image"
        [attr.data-state]="state()"
        [src]="src()"
        [alt]="alt()"
        (load)="state.set('loaded')"
        (error)="state.set('error')"
      />
    }
    @if (showFallback()) {
      <span data-part="fallback">{{ initialsText() }}<ng-content /></span>
    }
    @if (status()) {
      <span data-part="status" [attr.data-status]="status()" [attr.aria-label]="status()"></span>
    }
  `,
})
export class CkAvatar {
  readonly src = input<string>();
  readonly alt = input("");
  readonly size = input<IconSize>("md");
  readonly status = input<"online" | "offline" | "busy" | "away">();
  readonly initials = input<string>();
  readonly squared = input(false, { transform: booleanAttribute });
  readonly bordered = input(false, { transform: booleanAttribute });

  // v0 had no loaded/error state, so a slow or broken image left a visible gap.
  protected readonly state = signal<"loading" | "loaded" | "error">("loading");
  protected readonly showFallback = computed(() => !this.src() || this.state() === "error");
  protected readonly initialsText = computed(() => {
    const n = this.initials();
    if (!n) return "";
    return n
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? "")
      .join("");
  });
  protected readonly attr = ckDataAttr;
}

@Component({
  selector: "ck-progress",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "progress",
    "data-part": "root",
    "[attr.data-variant]": "variant()",
    "[attr.data-indeterminate]": "attr(indeterminate())",
  },
  template: `
    @if (label() || showValue()) {
      <div data-part="label">
        <span>{{ label() }}</span>
        @if (showValue() && !indeterminate()) {
          <span data-part="value-text">{{ rounded() }}%</span>
        }
      </div>
    }
    <div
      data-part="track"
      [attr.data-size]="size()"
      role="progressbar"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="indeterminate() ? null : value()"
    >
      <div
        data-part="range"
        [attr.data-striped]="attr(striped())"
        [attr.data-animated]="attr(animated())"
        [style.--ck-progress-percent]="percent()"
      ></div>
    </div>
  `,
})
export class CkProgress {
  readonly value = input<number | null>(null);
  readonly max = input(100);
  readonly variant = input<"primary" | Status>("primary");
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly showValue = input(false, { transform: booleanAttribute });
  readonly striped = input(false, { transform: booleanAttribute });
  readonly animated = input(false, { transform: booleanAttribute });

  // The value alone decides indeterminate — v0 had a separate boolean that
  // could disagree with it.
  protected readonly indeterminate = computed(() => this.value() == null);
  protected readonly percent = computed(() =>
    this.indeterminate() ? 0 : Math.min(100, Math.max(0, (this.value()! / this.max()) * 100))
  );
  protected readonly rounded = computed(() => Math.round(this.percent()));
  protected readonly attr = ckDataAttr;
}
