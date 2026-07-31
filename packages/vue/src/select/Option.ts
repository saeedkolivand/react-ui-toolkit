import { defineComponent } from "vue";

/**
 * Declarative alternative to Select's `items`. Renders nothing itself — Select
 * reads these props off the slot vnodes to build the collection, so the machine
 * still owns typeahead and keyboard navigation.
 *
 * ponytail: a render-nothing component beats a provide/inject registration
 * dance, because the collection has to exist before the first paint anyway.
 * Ceiling: an Option wrapped in another component is invisible. Pass `items`
 * for anything dynamic.
 */
export default defineComponent({
  name: "CkOption",
  props: {
    value: { type: String, required: true },
    /** Falls back to the slot text, then to `value`. */
    label: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup: () => () => null,
});
