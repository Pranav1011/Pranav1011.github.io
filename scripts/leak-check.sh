#!/usr/bin/env bash
# Fails if any tracked file contains private material or local filesystem paths.
# Runs locally (npm run leak-check) and in CI before every deploy.
set -euo pipefail

PATTERN='offer|transcript|resume-only|confident framing|/Users/|/home/[a-z]|/private/(tmp|var)|~/|[A-Za-z]:\\\\Users|Documents/|Downloads/|Desktop/'

if git grep -nIiE "$PATTERN" -- . ':!scripts/leak-check.sh'; then
  echo
  echo "Leak check failed: the matches above must not be committed to this public repo." >&2
  exit 1
fi

echo "Leak check passed: $(git ls-files | wc -l | tr -d ' ') tracked files, no matches."
