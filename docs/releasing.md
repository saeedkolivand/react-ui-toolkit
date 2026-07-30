# Release Process

Releases are fully automated with [semantic-release](https://semantic-release.gitbook.io/). There is
no manual version bump — **the version is derived from your commit messages**.

## How it works

Every push to `main` runs `.github/workflows/release.yml`, which:

1. Runs lint, typecheck and the test suite.
2. Reads the commits since the last git tag and decides the next version.
3. Updates `CHANGELOG.md`.
4. Publishes to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements)
   (`prepublishOnly` cleans and builds first).
5. Commits `CHANGELOG.md` + `package.json`, tags it, and creates the GitHub release.

If no commit since the last release warrants one, nothing is published.

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

## Required repository secrets

| Secret         | Used for                                                               |
| -------------- | ---------------------------------------------------------------------- |
| `NPM_TOKEN`    | publishing to npm — must be an **automation** token so it bypasses 2FA |
| `GITHUB_TOKEN` | provided automatically; creates the tag, release and comments          |

## Manual release

Not supported, deliberately. The previous flow bumped the version and published to npm
unconditionally but only pushed the tag when a `should_release` input was set — which is how
`package.json` ended up pinned at 0.1.17 while npm and the git tags had already moved to 0.1.18. If
you need to intervene, fix the commit history and let the workflow run.
