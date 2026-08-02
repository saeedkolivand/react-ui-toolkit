---
"@crosskit-ui/styles": patch
---

Apply the font token the stylesheet already shipped.

`--ck-font-sans` was defined in the tokens and never used: the only file
referencing it, `theme.css`, is a Tailwind bridge that `index.css` does not
import. So every component inherited whatever font the host page happened to set,
and on a page that sets none it fell back to the browser default serif.

Applied in `reset.css`, which is safe because `ck.reset` is the first layer
declared and therefore the weakest — a consumer's own rule beats it whether they
layer it or not, and the intended override is to redefine the token.
