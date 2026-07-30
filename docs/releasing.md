# Release Process

Versioning is automated with [semantic-release](https://semantic-release.gitbook.io/) — there is no
manual version bump, **the version is derived from your commit messages**. _When_ to release is not
automated: merging to `main` publishes nothing.

## Cutting a release

Actions → **Release** → _Run workflow_ (on `main`). That runs
`.github/workflows/release.yml`, which:

1. Runs lint, typecheck and the test suite.
2. Reads the commits since the last git tag and decides the next version.
3. Updates `CHANGELOG.md`.
4. Publishes to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements)
   (`prepublishOnly` cleans and builds first).
5. Commits `CHANGELOG.md` + `package.json`, tags it, and creates the GitHub release.

If no commit since the last release warrants one, nothing is published.

Releases are deliberately manual so a refactor can land across many commits and ship as a single
release when it is ready, rather than publishing a version per merge. The cost of that choice is that
nothing reminds you — a merged fix stays unpublished until someone presses the button. Check
`npm run release:dry` against `main` if you are unsure whether anything is pending.

## What bumps the version

The commit convention is enforced by commitlint — locally via the `commit-msg` hook, and on every PR
in CI — so a malformed message is caught before it can break a release.

| Commit prefix                                            | Result                  | Example                                  |
| -------------------------------------------------------- | ----------------------- | ---------------------------------------- |
| `fix:`                                                   | patch — 0.1.18 → 0.1.19 | `fix(button): correct disabled contrast` |
| `feat:`                                                  | minor — 0.1.18 → 0.2.0  | `feat(table): add row selection`         |
| `feat!:` or `BREAKING CHANGE:` in the body               | major — 0.1.18 → 1.0.0  | see below                                |
| `chore:`, `docs:`, `test:`, `refactor:`, `style:`, `ci:` | no release              | `docs: fix typo`                         |

```
feat(select)!: replace options prop with children

BREAKING CHANGE: <Select options={...} /> is now <Select><Option /></Select>.
```

## Previewing a release

To see what would be published without publishing anything:

```bash
npm run release:dry
```

## Authentication — there is no npm token

npm auth uses [trusted publishing](https://docs.npmjs.com/trusted-publishers): the workflow proves
its identity to npm over OIDC and receives a short-lived credential. **No `NPM_TOKEN` secret exists,
and none should be added.** The only secret involved is `GITHUB_TOKEN`, which GitHub provides
automatically for the tag, the release and the comments.

The trust is configured on npmjs.com under **Package → Settings → Trusted Publisher**, and must match
the workflow exactly:

| Field             | Value                     |
| ----------------- | ------------------------- |
| Publisher         | GitHub Actions            |
| Organization/user | `saeedkolivand`           |
| Repository        | `react-ui-toolkit`        |
| Workflow filename | `release.yml`             |
| Environment name  | _(blank)_                 |
| Allowed actions   | Allow `npm publish`       |

Renaming `.github/workflows/release.yml` therefore breaks publishing until the trusted publisher is
updated to match. Provenance is generated automatically under OIDC.

### Why not a token

A token is not merely unnecessary — adding one back reintroduces the failure mode below. If the OIDC
exchange fails for any reason, `@semantic-release/npm` silently falls back to token auth. A token
that enforces 2FA then passes `verifyConditions` (which only runs `npm whoami`) and dies later at
`npm publish` with `EOTP`. npm is also
[phasing 2FA-bypass tokens out](https://gh.io/npm-gat-bypass2fa-deprecation) for direct publishing in
January 2027, so the token path is a dead end regardless.

With no token configured, a broken OIDC setup fails in `verifyConditions` — before any tag exists.

## Failure mode this replaced

semantic-release creates and pushes the git tag **between the `prepare` and `publish` stages**. A
failure at `npm publish` therefore leaves the tag, the release commit, the version bump and the
CHANGELOG entry behind while npm never receives the package.

That is not a cosmetic problem. On the next run semantic-release reads the tag, concludes that
version already shipped, reports "no release" and **exits green** — so the pipeline looks healthy
while publishing nothing. This happened twice with v1.0.0 in July 2026.

Recovering means deleting the tag and reverting the release commit:

```bash
git push origin :refs/tags/v1.0.0
git revert --no-commit <release-commit>
```

The token removal above is what prevents it from recurring.

## Required repository label

When a release fails, `@semantic-release/github` opens an issue labelled **`semantic-release`**.
GitHub rejects issue creation that references a label which does not exist, so if that label is ever
deleted the failure report fails too — and a broken release goes unreported:

```
Validation Failed: {"value":"semantic-release","resource":"Label","field":"name","code":"invalid"}
```

Recreate it with:

```bash
gh api -X POST repos/saeedkolivand/react-ui-toolkit/labels \
  -f name='semantic-release' -f color='2b7489' \
  -f description='Automated release failure reports opened by semantic-release'
```

## Manual release

Not supported, deliberately. The previous flow bumped the version and published to npm
unconditionally but only pushed the tag when a `should_release` input was set — which is how
`package.json` ended up pinned at 0.1.17 while npm and the git tags had already moved to 0.1.18. If
you need to intervene, fix the commit history and let the workflow run.
