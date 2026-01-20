#!/bin/bash

# Exit on error
set -e

# # Echo all env vars for debugging
# echo "DISCORD_CLIENT_ID: $DISCORD_CLIENT_ID"
# echo "DISCORD_CLIENT_SECRET: $DISCORD_CLIENT_SECRET"
# echo "DISCORD_BOT_TOKEN: $DISCORD_BOT_TOKEN"
# echo "SESSION_SECRET: ${SESSION_SECRET:0:8}***"

# Build a temporary wrangler config instead of mutating the repository file.
WRANGLER_CONFIG=".cloudflare/wrangler.generated.toml"
cp wrangler.toml "$WRANGLER_CONFIG"

cat <<EOF >> "$WRANGLER_CONFIG"

# Dynamic environment variables (injected at build time)
[env.production.vars]
DISCORD_CLIENT_ID = "$DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "$DISCORD_CLIENT_SECRET"
DISCORD_BOT_TOKEN = "$DISCORD_BOT_TOKEN"
EOF

npm run write-items
WRANGLER_TOML="$WRANGLER_CONFIG" npm run build
