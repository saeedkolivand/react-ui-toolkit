# Release Process

Versioning is handled by [Changesets](https://github.com/changesets/changesets). All seven packages
move in **lockstep** — one version number, every package, always — so there is never a compatibility
matrix between `@crosskit-ui/react` and `@crosskit-ui/core` to reason about.

_When_ to release is not automated: merging to `main` publishes nothing.

## Adding a changeset

Any PR that changes something a consumer can observe needs one:

```bash
pnpm changeset
```

Pick the packages, pick patch/minor/major, describe the change in a sentence. The file lands in
`.changeset/` and is reviewed alongside the code.

Infrastructure-only work — CI, tests, playgrounds, the docs site — does not need one.

## Cutting a release

1. The **Version PR** bot opens (and keeps updating) a PR on every push to `main`. It consumes the
   changeset files, bumps the version and writes `CHANGELOG.md`. Merge it when you want to ship.
2. Actions → **Release** → _Run workflow_. That runs lint, typecheck, build, the test suite and
   `check:exports`, then `pnpm changeset publish`.

Releases are deliberately manual so a refactor can land across many commits and ship as a single
release when it is ready, rather than publishing a version per merge. The cost of that choice is
that nothing reminds you — a merged fix stays unpublished until someone presses the button.

> The Version PR is opened with `GITHUB_TOKEN`, so `ci.yml` does not run on it. That is accepted:
> using a PAT to fix it would trade a real credential for a cosmetic gain on a PR that only ever
> contains version bumps and changelog entries.

## Commit convention

Enforced by commitlint — locally via the `commit-msg` hook and on every PR in CI. Note that unlike
the previous semantic-release setup, **commit messages no longer determine the version**; the
changeset files do. The convention is kept because it makes history readable and the changelog tidy.

## Authentication — there is no npm token

npm auth uses [trusted publishing](https://docs.npmjs.com/trusted-publishers): the workflow proves
its identity to npm over OIDC and receives a short-lived credential. **No `NPM_TOKEN` secret exists,
and none should be added.** The only secret involved is `GITHUB_TOKEN`, which GitHub provides
automatically.

Trust is configured **per package** on npmjs.com under **Package → Settings → Trusted Publisher**,
and must match the workflow exactly:

| Field             | Value               |
| ----------------- | ------------------- |
| Publisher         | GitHub Actions      |
| Organization/user | `saeedkolivand`     |
| Repository        | `crosskit`          |
| Workflow filename | `release.yml`       |
| Environment name  | _(blank)_           |
| Allowed actions   | Allow `npm publish` |

Two things that bite:

- The workflow filename is matched as a **bare filename**, never a path. Renaming
  `.github/workflows/release.yml` breaks publishing until every package's trusted publisher is
  updated — and it surfaces as a misleading `E404`.
- **A trusted publisher cannot be configured before a package's first publish.** New packages need a
  bootstrap publish first; see `scripts/bootstrap-npm-trusted-publishing.sh`, which requires an
  interactive login and cannot be automated.

### Why not a token

A token is not merely unnecessary — adding one back reintroduces a failure mode. If the OIDC exchange
fails for any reason, the publish silently falls back to token auth. A token that enforces 2FA then
passes the credential check (which only runs `npm whoami`) and dies later at `npm publish` with
`EOTP`. npm is also
[phasing 2FA-bypass tokens out](https://gh.io/npm-gat-bypass2fa-deprecation) for direct publishing in
January 2027, so the token path is a dead end regardless.

With no token configured, a broken OIDC setup fails immediately rather than halfway through.

## Failure mode this replaced

Kept because it explains why the release flow looks the way it does.

semantic-release created and pushed the git tag **between the `prepare` and `publish` stages**. A
failure at `npm publish` therefore left the tag, the release commit, the version bump and the
CHANGELOG entry behind while npm never received the package.

That is not a cosmetic problem. On the next run semantic-release read the tag, concluded that version
had already shipped, reported "no release" and **exited green** — so the pipeline looked healthy
while publishing nothing. This happened twice with v1.0.0 in July 2026.

Changesets does not have that shape: `changeset publish` publishes first and tags after, and it skips
any package whose version already exists on the registry, so a partial failure is safe to re-run.

## Manual release

Not supported, deliberately. The flow before semantic-release bumped the version and published
unconditionally but only pushed the tag when a `should_release` input was set — which is how
`package.json` ended up pinned at 0.1.17 while npm and the git tags had already moved to 0.1.18. If
you need to intervene, fix the history and let the workflow run.
