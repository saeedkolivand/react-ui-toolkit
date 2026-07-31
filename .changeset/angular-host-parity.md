---
"@crosskit-ui/styles": patch
"@crosskit-ui/angular": patch
---

Close the last cross-framework gaps: root parts now pin their own `display` so an Angular element host cannot change the box, wrapping Angular hosts are `display: contents`, and `CkRadio` renders `selected` rather than ignoring it.
