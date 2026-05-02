#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
./scripts/aivexy-env-check.sh || true
docker compose build --pull
