# saddlebag-with-pockets

The frontend of https://saddlebagexchange.com/

Last updated for FFXIV 6.51

_Frontend for Aetheryte API_

## Prerequisites

- Node `20.3.0`
- Discord Application (for OAuth functionality)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

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

For Windows:

```bash
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.
Check your terminal for the address, the default is `http://127.0.0.1:8788`

## Discord OAuth Setup

To enable Discord login functionality, you need to set up a Discord application:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "OAuth2" section
4. Add your redirect URI: `http://localhost:8788/discord-callback` (for development)
5. Copy your Client ID and Client Secret
6. Set the following environment variables:
   - `DISCORD_CLIENT_ID`: Your Discord application client ID
   - `DISCORD_CLIENT_SECRET`: Your Discord application client secret
   - `DISCORD_BOT_TOKEN`: Your Discord bot token for pulling role ids

For production, update the redirect URI to your production domain.

## FFXIV Items list

You can fetch and update the ffxiv items list if you find items are missing using:

```bash
yarn run write-items
prettier -w app/utils/items/items.ts
```

### Testing

We have just started to use [Vitest](https://vitest.dev) to run unit tests.

We are currently using the .test.ts ending to mark our test files for the test runner.
For any route level testing, such as action files or loaders keep your test files in the `app/test/routes` folder.
For other files try to keep your test files in the same folder as the file your testing. If this gets out of hand we can try to manage the test files into the test folder too. We'll see how it goes.

You can run all unit tests by running:

```bash
yarn test
```

You can run a single unit test file by running

```bash
yarn test testFile
```

You can set vite into watch mode by passing the watch arguement:

```bash
yarn test watch
```

<!-- ### Docker

Alternatively, you can use docker to run the server:

```bash
docker-compose up --build
```

Any subsequent runs will not require you to rebuild the images:

```bash
docker-compose up
```

> NOTE: any changes to the `Dockerfile` or dependencies will require you to rebuild the images.
 -->

## Deployment

Commit to `master`. Auto deploys to CloudFlare.

https://dash.cloudflare.com/131d3ef77f51b43d39c70f2e5b65c34c/pages/view/saddlebag-with-pockets

## Architecture

For those interested, we're using the following in the front-end architecture:

- [Remix Run](https://remix.run/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Package upgrades

Can always upgrade some packages easily without breaking anything. These are handled with:

```
./low-impact-package-upgrade.sh
```
