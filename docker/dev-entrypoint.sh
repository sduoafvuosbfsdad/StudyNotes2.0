#!/bin/sh
set -eu

LOCKFILE="package-lock.json"
CHECKSUM_FILE="node_modules/.package-lock.sha256"

# Determine whether a reinstall is needed
NEEDS_INSTALL=0

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  NEEDS_INSTALL=1
elif [ -f "$LOCKFILE" ]; then
  # Reinstall when the lockfile has changed since the last successful install
  CURRENT_SUM=$(sha256sum "$LOCKFILE" | awk '{print $1}')
  STORED_SUM=""
  if [ -f "$CHECKSUM_FILE" ]; then
    STORED_SUM=$(cat "$CHECKSUM_FILE")
  fi
  if [ "$CURRENT_SUM" != "$STORED_SUM" ]; then
    NEEDS_INSTALL=1
  fi
fi

if [ "$NEEDS_INSTALL" = "1" ]; then
  echo "[docker] Installing dependencies..."
  npm ci
  # Record the lockfile checksum only after a successful install so that a
  # failed npm ci does not mark the broken state as valid.
  if [ -f "$LOCKFILE" ]; then
    sha256sum "$LOCKFILE" | awk '{print $1}' > "$CHECKSUM_FILE"
  else
    rm -f "$CHECKSUM_FILE"
  fi
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
