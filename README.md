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
Check your terminal for the address, the default is `http://127.0.0.1:8788`

### Testing

We have just started to use [Jest](https://jestjs.io/) to run unit tests.

We are currently using the .test.ts ending to mark our test files for the test runner.
Please try to keep your test files in the same folder as the file your testing.

You can run all unit tests by running:

```bash
yarn test
```

You can run a single unit test file by running

```bash
yarn test -testFile.test.ts
```

You can set jest into watch mode by passing the watch arguement:

```bash
yarn test --watch
```

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

- [Remix Run](https://remix.run/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
