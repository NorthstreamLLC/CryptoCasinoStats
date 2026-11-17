#!/usr/bin/env bash
# Ship to production safely: everything that can fail on Vercel fails here first.
#
#   scripts/ship.sh            check, then push HEAD to main and confirm the live deploy
#   scripts/ship.sh --check    run the checks only, push nothing
#
# Steps: rebase on origin/main, type check, then the full production build, which
# renders every page. Only then is anything pushed, and the script waits for the
# Production deployment of exactly that commit and reports its result.
# (Adapted from CryptoSlotGuide's scripts/ship.sh.)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"
CHECK_ONLY=0
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=1
step() { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
fail() { printf '\n\033[31m✗ %s\033[0m\n' "$*"; exit 1; }

cd "$ROOT"
[[ -z "$(git status --porcelain)" ]] || fail "Uncommitted changes: commit or stash them first."

step "Rebase on origin/main"
git fetch -q origin main
git rebase -q origin/main || fail "Rebase failed: resolve it, then run again."

cd "$WEB"
step "Type check"
rm -rf .next/dev/types .next/types  # generated; stale copies can name deleted pages
npx tsc --noEmit -p . || fail "Type errors."

step "Production build (renders every page)"
LOG="$(mktemp)"
if ! npm run -s build >"$LOG" 2>&1; then
  grep -nE "Error|error" "$LOG" | head -20
  fail "Build failed; nothing was pushed. Full log: $LOG"
fi
[[ -z "$(git -C "$ROOT" status --porcelain)" ]] || { git -C "$ROOT" status --short; fail "The build left changed files; check them before shipping."; }
echo "Build passed."

[[ $CHECK_ONLY == 1 ]] && { printf '\n\033[32m✓ All checks passed (--check: nothing pushed).\033[0m\n'; exit 0; }

cd "$ROOT"
SHA="$(git rev-parse HEAD)"
PUSHED="$(date -u -d "-20 seconds" +%Y-%m-%dT%H:%M:%SZ)"  # a little slack for clock drift
step "Push ${SHA:0:7} to main"
for i in 1 2 3 4; do git push -q origin HEAD:main && break; [[ $i == 4 ]] && fail "Push failed."; sleep $((i * 2)); done

step "Wait for the Production deployment of ${SHA:0:7}"
REPO=NorthstreamLLC/cryptocasinostats
# Vercel's commit status, counted only from after this push: a commit that was
# built as a branch preview first (the review flow) already carries the
# preview's "success", which is not the Production deploy (16 Nov 2026).
# (Since the repo went private, the deployments list is not readable from here.)
STATE=""
for _ in $(seq 1 60); do
  STATE="$(gh api "repos/$REPO/commits/$SHA/statuses?per_page=100" --jq "[.[] | select(.context==\"Vercel\" and .created_at >= \"$PUSHED\")][0].state // \"\"" 2>/dev/null || true)"
  [[ "$STATE" == success || "$STATE" == failure || "$STATE" == error ]] && break
  sleep 20
done
[[ "$STATE" == success ]] || fail "Production deployment: ${STATE:-not seen after 20 minutes}. The live site keeps the previous version."
printf '\n\033[32m✓ Live: %s is deployed to production.\033[0m\n' "${SHA:0:7}"
