# Saddlebag with Pockets

The web frontend for [Saddlebag Exchange](https://saddlebagexchange.com/), a market-analysis tool for Final Fantasy XIV, World of Warcraft, and Guild Wars 2.

It is a [Remix](https://remix.run/) application deployed on [Cloudflare Pages](https://pages.cloudflare.com/). The API contract is available in the [Saddlebag Exchange documentation](https://docs.saddlebagexchange.com/docs).

## Requirements

- [Node.js](https://nodejs.org/) `22.23.2` (see [`.nvmrc`](.nvmrc))
- [Corepack](https://nodejs.org/api/corepack.html) to provide Yarn `1.22.22`

If you use `nvm`:

```bash
nvm install
nvm use
corepack enable
```

## Quick start

```bash
yarn install --frozen-lockfile
yarn dev
```

The development server rebuilds assets as files change. Use the URL printed by Remix in the terminal.

## Useful commands

| Command               | Purpose                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `yarn dev`            | Start the local development environment.                                                    |
| `yarn build`          | Create a production build.                                                                  |
| `yarn dev:wrangler`   | Serve the generated `public/` assets with Cloudflare Pages tooling. Run `yarn build` first. |
| `yarn test`           | Run the Vitest test suite.                                                                  |
| `yarn prettier:check` | Check formatting under `app/`.                                                              |
| `yarn prettier`       | Format files under `app/`.                                                                  |
| `yarn write-items`    | Refresh FFXIV, WoW, and GW2 item-data files.                                                |

To run a single test file or keep Vitest running:

```bash
yarn test app/test/routes/discord-oauth.test.ts
yarn test --watch
```

## Local Cloudflare Pages runtime

For a production-style local run, build first and then use Wrangler:

```bash
yarn build
yarn dev:wrangler
```

Wrangler reads Cloudflare bindings and secrets from `.dev.vars` when present. Never commit that file or production credentials.

## Optional Discord OAuth setup

Discord authentication is only needed when developing or testing the Discord login and role-refresh routes. Create a Discord application in the [Discord Developer Portal](https://discord.com/developers/applications), configure a local redirect URI such as `http://localhost:8788/discord-callback`, and provide these values to the Cloudflare Pages runtime:

```dotenv
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_BOT_TOKEN=your-bot-token
```

The production redirect URI must match the deployed site URL registered in Discord. `SITE_NAME` is optional and defaults to `Saddlebag Exchange`.

## Contributing

Read the [contribution guide](docs/CONTRIBUTING.md) and [styling guide](docs/STYLING.md) before submitting a change. The repository uses conventional commit messages and keeps `master` stable.

## Documentation

Additional project documentation is listed in [docs/INDEX.md](docs/INDEX.md).
