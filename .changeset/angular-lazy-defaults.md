---
"@crosskit-ui/zag-angular": patch
"@crosskit-ui/react": patch
"@crosskit-ui/vue": patch
---

Fix Angular ignoring every `default*` machine prop: `bindable` now seeds its initial value on first use rather than at construction, so `defaultValue` reaches zag after Angular has applied inputs. Removes `RadioGroup.name`, which silently did nothing in every adapter.
