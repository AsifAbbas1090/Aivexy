#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test -f .env || { echo "Missing .env — cp .env.example .env && nano .env"; exit 1; }
for k in DATABASE_URL NEXTAUTH_URL NEXTAUTH_SECRET NEXT_PUBLIC_URL; do
  if ! grep -q "^${k}=" .env 2>/dev/null; then
    echo "WARN: set $k in .env"
  fi
done
echo "Done (warnings only unless .env missing)."
