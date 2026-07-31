---
"@crosskit-ui/vue": patch
"@crosskit-ui/angular": patch
---

Fix three divergences the cross-framework parity matrix found: Vue's Input and Textarea sent every native attribute to the wrapper instead of the control; Angular's Tabs, Accordion and Menu crashed with NG0950 by reading a required input during construction; Angular's Input and Textarea had no way to set placeholder, type, name, required or readonly.
