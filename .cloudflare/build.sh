#!/bin/bash
set -e

# Note: wrangler.toml should exist in the repo root
# Environment variables are injected via Cloudflare's build system

yarn run write-items
yarn run build

# Copy client assets to public/build for Cloudflare Pages static serving
if [ ! -d "build/client" ]; then
  echo "Error: build/client directory does not exist. Build may have failed."
  exit 1
fi

mkdir -p public/build
cp -r build/client/* public/build/
