#!/usr/bin/env bash
set -euo pipefail
node "$(dirname "$0")/github-actions-cache-check.mjs" "$@"
