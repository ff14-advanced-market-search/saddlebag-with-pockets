# Local Development Setup

This file documents local development setup for this Remix v2 + Cloudflare Pages project.

## Known Issue: Missing Functions Directory in Local Dev

When running `yarn dev` locally with wrangler, you may see:

```
No Functions. Shimming...
GET / 404 Not Found
```

This is a known limitation of wrangler's local dev environment with Remix v2 + Cloudflare Pages. The `functions/[[path]].js` directory is gitignored because:

1. It's dynamically generated in production by Cloudflare Pages
2. Local development with wrangler has a quirk where it doesn't auto-detect it

## Setup for Local Testing

### Quick Fix (One-time)

The `functions/[[path]].js` file is already created and gitignored. To test locally:

```bash
# The file already exists in your working directory
# Just ensure you have it:
mkdir -p functions
# File should be at functions/[[path]].js pointing to ../build/index.js
```

### Run Dev Server

```bash
yarn dev
```

## Testing Alternatives

### Option 1: Use Cloudflare Pages Preview (Recommended)

- Push your branch to GitHub
- Cloudflare Pages automatically deploys preview environments
- Full functionality works in preview (all features tested before merge)
- URL format: `https://branch-name.project.pages.dev`

### Option 2: Build Only (No Server)

```bash
yarn build
# Inspects build output without running wrangler dev
```

### Option 3: Run Remix Dev Without Wrangler

```bash
remix dev
# Runs Remix dev server without Cloudflare Workers environment
# Trade-off: Misses Cloudflare-specific issues but allows quick iteration
```

## Production Deployment

Cloudflare Pages handles everything automatically in production. No manual setup needed - just merge to master and deploy!
