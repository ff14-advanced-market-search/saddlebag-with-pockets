#!/bin/bash

# Exit on error
set -e

# # Echo all env vars for debugging
# echo "DISCORD_CLIENT_ID: $DISCORD_CLIENT_ID"
# echo "DISCORD_CLIENT_SECRET: $DISCORD_CLIENT_SECRET"
# echo "DISCORD_BOT_TOKEN: $DISCORD_BOT_TOKEN"
# echo "SESSION_SECRET: ${SESSION_SECRET:0:8}***"

# Append environment variables to wrangler.toml (dynamic generation)
# Use the production environment to avoid redefining the root [vars] table.
cat <<EOF >> wrangler.toml

# Dynamic environment variables (injected at build time)
[env.production.vars]
DISCORD_CLIENT_ID = "$DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "$DISCORD_CLIENT_SECRET"
DISCORD_BOT_TOKEN = "$DISCORD_BOT_TOKEN"
EOF

npm run write-items
npm run build
