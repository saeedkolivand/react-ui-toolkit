---
"@crosskit-ui/react": patch
"@crosskit-ui/vue": patch
"@crosskit-ui/svelte": patch
"@crosskit-ui/angular": patch
---

Move `aria-invalid` off individual radios and onto the radio group, where ARIA actually supports it. `RadioGroup` gains an `invalid` prop; `data-invalid` on the radio is unchanged.
