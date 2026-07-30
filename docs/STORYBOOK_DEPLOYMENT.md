# Deploying the site to GitHub Pages

One workflow publishes both halves of the site: the landing page at the root and Storybook one level
down.

| Path                                                          | Content      | Built by                  |
| ------------------------------------------------------------- | ------------ | ------------------------- |
| `https://saeedkolivand.github.io/react-ui-toolkit/`           | Landing page | `npm run build:landing`   |
| `https://saeedkolivand.github.io/react-ui-toolkit/storybook/` | Storybook    | `npm run build-storybook` |

## Automatic deployment

`.github/workflows/pages.yml` runs on every push to `main`. It builds the library (the landing page
imports the library's own components, so `dist/styles.css` has to exist first), then the landing
page, then Storybook, assembles them into `site/` and uploads that directly to the Pages service as
a build artifact.

There is no `gh-pages` branch — the built site is not stored in git at all. `main` is the only branch
this repo keeps.

It can also be run by hand from the Actions tab → "Deploy Pages" → "Run workflow".

## Local preview

```bash
npm run landing:dev     # landing page with HMR, served at "/"
npm run storybook       # Storybook at :6006, served at "/"
```

To reproduce the deployed layout exactly:

```bash
npm run build && npm run build:landing
STORYBOOK_BASE_PATH=/react-ui-toolkit/storybook/ npm run build-storybook
mkdir -p site/storybook && cp -r landing-dist/. site/ && cp -r storybook-static/. site/storybook/
```

Then serve the parent directory so the page sits under `/react-ui-toolkit/`.

> On Windows Git Bash, prefix the Storybook command with `MSYS_NO_PATHCONV=1`. Otherwise MSYS
> rewrites the leading `/` of the base path into your Git install directory and every asset URL comes
> out as `/Program Files/Git/react-ui-toolkit/...`. This does not affect CI, which runs on Linux.

## Base paths

- **Landing page**: `base` in `vite.landing.config.mts`, overridable with `LANDING_BASE`.
- **Storybook**: `STORYBOOK_BASE_PATH` in `.storybook/main.ts`, defaulting to `/` so local dev works
  unchanged. The Pages workflow sets it to `/react-ui-toolkit/storybook/`.

## Repository settings

Settings → Pages → Source must be **GitHub Actions**, not a branch. Switching it back to a branch
breaks the deploy, since nothing pushes a branch any more.

No `.nojekyll` file is needed: artifact deploys bypass Jekyll entirely, so Vite's `_`-prefixed asset
directories survive on their own.

## Troubleshooting

**Assets 404 after deploy** — the base path and the actual URL disagree. Check the two settings
above.

**Workflow fails with a permission error** — `pages.yml` needs `pages: write` and `id-token: write`,
which it declares.
Confirm Actions has write permission in repository settings.
