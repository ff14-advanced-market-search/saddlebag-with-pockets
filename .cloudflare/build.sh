#!/bin/bash

# # Echo all env vars for debugging
# echo "DISCORD_CLIENT_ID: $DISCORD_CLIENT_ID"
# echo "DISCORD_CLIENT_SECRET: $DISCORD_CLIENT_SECRET"
# echo "DISCORD_BOT_TOKEN: $DISCORD_BOT_TOKEN"
# echo "NODE_VERSION: $NODE_VERSION"
# echo "SITE_NAME: $SITE_NAME"

# Write wrangler.toml dynamically
cat <<EOF > wrangler.toml
[vars]
DISCORD_CLIENT_ID = "$DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "$DISCORD_CLIENT_SECRET"
DISCORD_BOT_TOKEN = "$DISCORD_BOT_TOKEN"
EOF

npm run write-items
npm run build
