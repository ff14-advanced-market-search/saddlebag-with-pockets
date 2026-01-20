#!/bin/bash
set -e

# Note: wrangler.toml should exist in the repo root
# Environment variables are injected via Cloudflare's build system

yarn run write-items
yarn run generate:css
yarn run build

# Copy client assets to public/build for Cloudflare Pages static serving
mkdir -p public/build
cp -r build/client/* public/build/ || true
