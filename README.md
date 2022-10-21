# saddlebag

_Frontend for Aetheryte API_

## Prerequisites

- Node `16.13.0`

## [Documentation](docs/INDEX.md)

## Getting Started

Install the dependencies:

```bash
yarn install
```

Run Server:

```bash
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.
Runs the server via `wrangler` in `local` mode.
Check your terminal for the address, the default is `http://127.0.0.1:8787`

- You may need to `wrangler login` before being able to run the command properly.

### Docker

Alternatively, you can use docker to run the server:

```bash
docker-compose up --build
```

Any subsequent runs will not require you to rebuild the images:

```bash
docker-compose up
```

> NOTE: any changes to the `Dockerfile` or dependencies will require you to rebuild the images.

## Deployment

Commit to `master`. Auto deploys to CloudFlare Workers.


## Architecture

For those interested, we're using the following in the front-end architecture:

- [Remix Run](https://remix.run/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
