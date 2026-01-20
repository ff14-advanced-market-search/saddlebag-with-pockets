#!/bin/bash
set -e

# Note: wrangler.toml should exist in the repo root
# Environment variables are injected via Cloudflare's build system

yarn run write-items
yarn run build
