# zag-angular behaviour suite

These specs drive `@zag-js/dialog` through the Angular binding and assert the
behaviours that motivate the whole architecture: focus trap, controlled
round-trip, portal, ARIA wiring, scroll lock, and exit animations.

They need a host Angular app to run against. The one used to develop them is a
throwaway scaffold (Angular 22, zoneless, SSR) that renders a `<ck-modal>`; it
is not checked in. To re-run:

1. `ng new` a zoneless Angular 22 app with SSR.
2. Copy `packages/zag-angular/src` into it as `src/zag`.
3. Add a `ck-modal` component that wires `@zag-js/dialog` through `useMachine`,
   gates rendering on `usePresence`, and puts `[ckPresenceNode]` on the content.
4. Point `playwright.config.ts` `baseURL` at the dev server and run this suite.

Proper wiring of this into CI comes with `apps/playground-angular`, where these
specs become part of the cross-framework parity matrix.

## Current state

Passing consistently: machine drives the dialog with correct `data-*`; content
portals to `document.body`; focus trap enters, wraps both directions and
restores to the trigger; Escape closes and `closeOnEscape=false` prevents it;
`aria-labelledby` resolves; controlled `[(open)]` round-trips; **exit animation
holds `data-state="closed"` before unmount**.

Known flaky: rapid repeated open/close cycles, and occasionally outside-click
dismissal. Across three consecutive runs the suite scored 7/9, 7/9 and 6/9 with
the failures moving between those two specs. See the note in `machine.ts` about
the `send()` re-entrancy guard — the hazard is real and guarded, but it is not
the whole story. This does not affect normal interaction; it needs a dedicated
pass before the Angular adapter ships.
