#!/usr/bin/env bash
# Production build + per-chunk size report (raw and gzipped).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
echo
printf '%-42s %10s %10s\n' "chunk" "raw" "gzip"
for f in dist/assets/*.js; do
  raw=$(wc -c < "$f" | tr -d ' ')
  gz=$(gzip -c "$f" | wc -c | tr -d ' ')
  printf '%-42s %8s B %8s B\n' "$(basename "$f")" "$raw" "$gz"
done
