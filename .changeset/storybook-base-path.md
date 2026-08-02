---
---

Fix the deployed Storybook, whose preview pane never loaded.

`turbo` 2 runs tasks in strict env mode: a task receives only the variables its
config names. The deploy workflow set `STORYBOOK_BASE_PATH=/storybook/`, the
build never saw it, and Storybook fell back to base `/` — emitting its preview
bundle as `/assets/iframe-*.js` on a site served from `/storybook/`.

The manager loaded anyway, because it uses relative `./sb-manager/` paths. That
is why the failure looked the way it did: a fully populated sidebar over a pane
that span forever, on every component.

Declaring the variables also puts them in the cache key, so a build made at one
base path can no longer be replayed for another.
