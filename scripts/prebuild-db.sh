#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "[prebuild-db] Applying Prisma schema to DATABASE_URL..."
  pnpm exec prisma db push
else
  echo "[prebuild-db] DATABASE_URL unset — skipping db push (in-memory mode)."
fi
