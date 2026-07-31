import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  input,
  model,
} from "@angular/core";
import * as select from "@zag-js/select";
import type { FieldVariant, Size } from "@crosskit-ui/core";
import {
  ckDataAttr,
  CkPortal,
  normalizeProps,
  useMachine,
  ZagSpread,
} from "@crosskit-ui/zag-angular";
import { CkIcon } from "../icon/icon.component";

let uid = 0;

export interface CkSelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Declarative alternative to `[items]`. Renders nothing — CkSelect reads these
 * via `contentChildren`, so the machine still owns typeahead and keyboard
 * navigation.
 *
 * `<ck-option value="ng" label="Nigeria" />`
 */
@Directive({ selector: "ck-option", standalone: true })
export class CkOption {
  readonly value = input.required<string>();
  /** Falls back to `value`. */
  readonly label = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
}

@Component({
  selector: "ck-select",
  standalone: true,
  imports: [CkPortal, ZagSpread, CkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [zagSpread]="api().getRootProps()"
      [attr.data-size]="size()"
      [attr.data-variant]="variant()"
      [attr.data-invalid]="attr(invalid())"
      [attr.data-full-width]="attr(fullWidth())"
    >
      @if (label()) {
        <label [zagSpread]="api().getLabelProps()">{{ label() }}</label>
      }
      <div [zagSpread]="api().getControlProps()">
        <button
          [zagSpread]="labelled(api().getTriggerProps())"
          [attr.aria-describedby]="describedBy()"
        >
          <span [zagSpread]="api().getValueTextProps()">{{
            api().valueAsString || placeholder()
          }}</span>
          <span [zagSpread]="api().getIndicatorProps()">
            <svg ckIcon name="chevronDown" size="sm"></svg>
          </span>
        </button>
      </div>
      <select [zagSpread]="labelled(api().getHiddenSelectProps())">
        @for (item of resolved(); track item.value) {
          <option [value]="item.value">{{ item.label }}</option>
        }
      </select>
      @if (errorMessage()) {
        <p [id]="selectId() + '-error'" data-part="error-text">{{ errorMessage() }}</p>
      } @else if (helperText()) {
        <p [id]="selectId() + '-helper'" data-part="helper-text">{{ helperText() }}</p>
      }
      <!-- Options project here so contentChildren sees them; they render nothing. -->
      <ng-content />
    </div>
    <ck-portal>
      <div [zagSpread]="api().getPositionerProps()">
        <ul [zagSpread]="labelled(api().getContentProps())">
          @for (item of resolved(); track item.value) {
            <li [zagSpread]="api().getItemProps({ item })">
              <span [zagSpread]="api().getItemTextProps({ item })">{{ item.label }}</span>
              <span [zagSpread]="api().getItemIndicatorProps({ item })">
                <svg ckIcon name="check" size="sm"></svg>
              </span>
            </li>
          }
        </ul>
      </div>
    </ck-portal>
  `,
})
export class CkSelect {
  readonly items = input<CkSelectItem[]>();
  readonly value = model<string | undefined>(undefined); // enables [(value)]
  readonly defaultValue = input<string>();
  readonly open = model<boolean | undefined>(undefined); // enables [(open)]
  readonly defaultOpen = input<boolean>();
  readonly placeholder = input("Select an option");
  readonly size = input<Size>("md");
  readonly variant = input<FieldVariant>("default");
  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly errorMessage = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(true, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly options = contentChildren(CkOption);
  private readonly instanceId = `ck-select-${++uid}`;
  protected readonly attr = ckDataAttr;

  protected readonly selectId = computed(() => this.id() ?? this.instanceId);
  protected readonly resolved = computed<CkSelectItem[]>(
    () =>
      this.items() ??
      this.options().map(o => ({
        value: o.value(),
        label: o.label() ?? o.value(),
        disabled: o.disabled(),
      }))
  );
  protected readonly describedBy = computed(() =>
    this.errorMessage()
      ? `${this.selectId()}-error`
      : this.helperText()
        ? `${this.selectId()}-helper`
        : null
  );

  // Field initializer => injection context. NOT ngOnInit.
  private readonly service = useMachine(select.machine, () => ({
    id: this.selectId(),
    collection: select.collection({
      items: this.resolved(),
      isItemDisabled: (item: CkSelectItem) => !!item.disabled,
    }),
    disabled: this.disabled(),
    required: this.required(),
    name: this.name(),
    invalid: this.invalid(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    // The machine is multi-select capable; v1 exposes single-select only, so
    // the string input is widened here and narrowed on the way out.
    value: this.value() == null ? undefined : [this.value() as string],
    defaultValue: this.defaultValue() == null ? undefined : [this.defaultValue() as string],
    onValueChange: (d: { value: string[] }) => this.value.set(d.value[0] ?? ""),
    onOpenChange: (d: { open: boolean }) => this.open.set(d.open),
  }));

  protected readonly api = computed(() => select.connect(this.service, normalizeProps));

  /**
   * Zag always points aria-labelledby at the label part. With no `label` that
   * element is never rendered, which would leave exactly the dangling ARIA
   * reference this port exists to stop shipping (bug 0.6).
   */
  protected labelled<T extends object>(attrs: T): T {
    return this.label() == null ? { ...attrs, "aria-labelledby": undefined } : attrs;
  }
}
