# saddlebag

_Frontend for Aetheryte API_

## Prerequisites

- Node `16.13.0`

## [Documentation](docs/INDEX.md)

## Getting Started

The frontend directory is bootstraped by `create-react-app` and `material-ui`
Install the dependencies:

```bash
yarn install
```

Run Server:

```bash
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.
Check your terminal for the address, the default is `http://127.0.0.1:8788`

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

Commit to `master`. Auto deploys to CloudFlare.

https://dash.cloudflare.com/131d3ef77f51b43d39c70f2e5b65c34c/pages/view/saddlebag-with-pockets

## Architecture

For those interested, we're using the following in the front-end architecture:

* [Remix Run](https://remix.run/)
* [Cloudflare Pages](https://pages.cloudflare.com/)
* [Tailwind CSS](https://tailwindcss.com/)
