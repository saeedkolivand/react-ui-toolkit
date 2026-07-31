#!/usr/bin/env bash
# One-time bootstrap of npm trusted publishing for the @crosskit-ui packages.
#
# WHY THIS EXISTS
# A trusted publisher cannot be configured before a package's first publish --
# npm requires the package to already exist on the registry. So each package
# gets one throwaway 0.0.0 publish from a laptop, after which CI publishes
# everything else over OIDC with provenance and no NPM_TOKEN.
#
# Placeholders rather than the real v1.0.0 on purpose: a laptop publish has no
# provenance attestation, permanently, for the version everyone looks at first.
#
# RUN THIS ONLY ONCE, and only after:
#   - the GitHub repo rename to saeedkolivand/crosskit  (done)
#   - the @crosskit-ui npm org exists                   (done)
#   - .github/workflows/release.yml is on the default branch
#
# Requires an interactive login (2FA), so it cannot be automated.
set -euo pipefail

REPO="saeedkolivand/crosskit"
WORKFLOW="release.yml"   # BARE FILENAME. A path here is the top cause of a
                         # misleading E404 at publish time.

# Order matters for the real release, not for placeholders, but keep it honest:
# core and styles before the adapters, zag-angular before angular.
PACKAGES=(core styles zag-angular react vue svelte angular)

cd "$(dirname "$0")/.."

# 11.5.1 is the real floor for the OIDC exchange. `npm trust` was documented as
# 11.15+, but it is present and takes this exact syntax in 11.14.1 -- verified
# against `npm trust --help` -- so the check reports rather than gates.
echo "==> npm CLI: $(npm --version)  (needs >= 11.5.1 for the OIDC exchange)"
# Probe for the flag, not for a version number -- and probe the SUBCOMMAND's
# help, not `npm trust --help`, which does not list it.
#
# npm 11.14.1 has `npm trust github` but sends no `permissions` field, and the
# registry rejects that with a bare "400 Bad Request" naming nothing:
#
#   npm error 400 Bad Request - POST .../-/package/@scope%2fpkg/trust
#
# npm 12 requires at least one of --allow-publish / --allow-stage-publish and
# sends them. So having the command is not enough; it has to take the flag.
npm trust github --help 2>&1 | grep -q -- "--allow-publish" || {
  echo
  echo "This npm cannot register a trusted publisher: 'npm trust github' does"
  echo "not accept --allow-publish, so the registry will reject it with a 400."
  echo "Upgrade and re-run:  npm i -g npm@latest"
  exit 1
}
npm whoami >/dev/null 2>&1 || { echo "Not logged in. Run: npm login"; exit 1; }
echo "==> logged in as: $(npm whoami)"

echo
echo "==> Step 1/3: publish 0.0.0 placeholders (expect an OTP prompt per package)"
for p in "${PACKAGES[@]}"; do
  dir="packages/$p"
  # The Angular packages publish their built dist/ via publishConfig.directory.
  #
  # --no-provenance is required HERE and nowhere else. Every package sets
  # publishConfig.provenance:true, which is right for the real release, but
  # provenance can only be generated inside a supported CI provider -- from a
  # laptop npm fails with:
  #
  #   EUSAGE  Automatic provenance generation not supported for provider: null
  #
  # These are 0.0.0 placeholders that exist purely so `npm trust` has a package
  # to attach to; nobody installs them. v1.0.0 goes out from release.yml with
  # provenance intact, which is the version that matters.
  #
  # Resumable. Each publish needs its own OTP, so a run WILL sometimes die
  # partway -- a mistyped code, an expired one, a browser tab left too long.
  # Re-running then skips whatever already landed, rather than failing on
  # EPUBLISHCONFLICT and leaving you to work out how far it got.
  if npm view "@crosskit-ui/$p" version >/dev/null 2>&1; then
    echo "--- @crosskit-ui/$p -- already published, skipping"
    continue
  fi
  echo "--- @crosskit-ui/$p"
  # pnpm, not npm. The Angular packages set publishConfig.directory:"dist" so
  # that the ng-packagr output is published as the package root -- that is a
  # pnpm/yarn field which npm has never supported and now warns about, so
  # `npm publish` shipped their SOURCE tree with no entry points at all.
  # `changeset publish` uses pnpm for a pnpm repo, so this matches the release.
  ( cd "$dir" && pnpm publish --access public --no-git-checks --no-provenance )
done

echo
echo "==> Step 2/3: register GitHub Actions as the trusted publisher"
for p in "${PACKAGES[@]}"; do
  # Same reasoning as above: safe to re-run.
  if npm trust list "@crosskit-ui/$p" 2>/dev/null | grep -qi github; then
    echo "--- @crosskit-ui/$p -- trusted publisher already set, skipping"
    continue
  fi
  echo "--- @crosskit-ui/$p"
  npm trust github "@crosskit-ui/$p" \
    --repository "$REPO" \
    --file "$WORKFLOW" \
    --yes
  sleep 2   # npm docs suggest spacing these out to avoid rate limiting
done

echo
echo "==> Step 3/3: verify"
for p in "${PACKAGES[@]}"; do
  echo "--- @crosskit-ui/$p"
  npm trust list "@crosskit-ui/$p"
done

cat <<'DONE'

Bootstrap complete.

Next:
  1. Run the Release workflow to publish 1.0.0-rc.0 to the `next` dist-tag.
     A green run is the only real proof the OIDC chain works end to end.
  2. Confirm the provenance badge renders on npmjs.com for all seven packages.
  3. Turn on "Require trusted publishing" at the @crosskit-ui org level so a
     leaked token can never publish these packages.
  4. Optionally deprecate the placeholders:
     npm deprecate "@crosskit-ui/core@0.0.0" "placeholder"
DONE
