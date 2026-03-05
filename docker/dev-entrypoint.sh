#!/bin/sh
set -eu

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "[docker] Installing dependencies..."
  npm ci
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
