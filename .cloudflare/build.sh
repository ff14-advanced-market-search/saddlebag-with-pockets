#!/bin/bash

# Echo all env vars for debugging (optional, remove if you don't want secrets in logs)
echo "DISCORD_CLIENT_ID: $DISCORD_CLIENT_ID"
echo "DISCORD_CLIENT_SECRET: $DISCORD_CLIENT_SECRET"
echo "NODE_VERSION: $NODE_VERSION"
echo "SITE_NAME: $SITE_NAME"

# Write wrangler.toml dynamically
cat <<EOF > wrangler.toml
[vars]
DISCORD_CLIENT_ID = "$DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "$DISCORD_CLIENT_SECRET"
EOF

npm run write-items
npm run build
