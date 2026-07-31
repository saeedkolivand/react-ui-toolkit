---
"@crosskit-ui/core": patch
"@crosskit-ui/styles": patch
"@crosskit-ui/react": patch
"@crosskit-ui/vue": patch
"@crosskit-ui/svelte": patch
"@crosskit-ui/angular": patch
"@crosskit-ui/zag-angular": patch
---

`applyPosition` now sets `position: fixed` itself rather than relying on a stylesheet rule that
never existed. The coordinates it writes are viewport-relative, so anything else measures them
from the wrong containing block — silently, since the element still renders.
