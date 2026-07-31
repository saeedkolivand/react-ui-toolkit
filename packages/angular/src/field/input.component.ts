import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { FieldVariant, Size } from "@crosskit-ui/core";
import { ckAriaAttr, ckDataAttr } from "@crosskit-ui/zag-angular";

let uid = 0;

@Component({
  selector: "ck-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "input",
    "data-part": "field",
    "[attr.data-variant]": "variant()",
    "[attr.data-invalid]": "attr(invalid())",
    "[attr.data-full-width]": "attr(fullWidth())",
  },
  template: `
    @if (label()) {
      <label data-part="label" [attr.for]="inputId()">{{ label() }}</label>
    }
    <div data-scope="input" data-part="control">
      <input
        [id]="inputId()"
        data-scope="input"
        data-part="input"
        [attr.data-size]="size()"
        [disabled]="disabled()"
        [attr.aria-invalid]="aria(invalid())"
        [attr.aria-describedby]="describedBy()"
      />
    </div>
    @if (errorMessage()) {
      <p [id]="inputId() + '-error'" data-part="error-text">{{ errorMessage() }}</p>
    } @else if (helperText()) {
      <p [id]="inputId() + '-helper'" data-part="helper-text">{{ helperText() }}</p>
    }
  `,
})
export class CkInput {
  readonly variant = input<FieldVariant>("default");
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly errorMessage = input<string>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly instanceId = `ck-input-${++uid}`;
  protected readonly inputId = computed(() => this.id() ?? this.instanceId);
  protected readonly describedBy = computed(() =>
    this.errorMessage()
      ? `${this.inputId()}-error`
      : this.helperText()
        ? `${this.inputId()}-helper`
        : null
  );

  protected readonly attr = ckDataAttr;
  protected readonly aria = ckAriaAttr;
}
