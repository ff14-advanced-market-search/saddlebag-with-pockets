#!/bin/bash

# Write wrangler.toml dynamically with environment variables
cat <<EOF > wrangler.toml
name = "saddlebag-with-pockets"
compatibility_date = "2025-06-04"
compatibility_flags = ["nodejs_compat"]

[vars]
DISCORD_CLIENT_ID = "$DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET = "$DISCORD_CLIENT_SECRET"
DISCORD_BOT_TOKEN = "$DISCORD_BOT_TOKEN"

[env.production]
compatibility_date = "2025-06-04"
compatibility_flags = ["nodejs_compat"]
EOF

yarn run write-items
yarn run build
