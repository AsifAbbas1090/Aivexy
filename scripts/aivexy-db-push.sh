#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# docker-compose.yml uses service name "app" (container aivexy_app)
WEB_SERVICE="${WEB_SERVICE:-app}"
docker compose exec -T "$WEB_SERVICE" pnpm exec prisma db push
