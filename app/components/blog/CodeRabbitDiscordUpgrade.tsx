import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'

const CODERABBIT_DISCORD_URL = 'https://www.coderabbit.ai/discord'
const SADDLEBAG_DISCORD_URL =
  'https://discord.com/servers/saddlebag-exchange-973380473281724476'
const SADDLEBAG_PATREON_URL = 'https://www.patreon.com/indopan'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title: 'How a Discord Agent Cleared Five Years of OSS Tech Debt'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'After years of stalled upgrade attempts and contributor churn, CodeRabbit Discord helped Saddlebag Exchange complete a 107-file frontend upgrade in one morning.'
    },
    {
      name: 'customHeading',
      content: 'One Morning, a Discord Agent, and Five Years of Tech Debt'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog/coderabbit-discord-frontend-upgrade'
    }
  ]
}

const CodeRabbitDiscordUpgrade = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Banner />

        <article className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
          <header className="bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 px-6 py-12 text-white sm:px-10 sm:py-16">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
              Open-source maintainer story
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              One Morning, a Discord Agent, and Five Years of Tech Debt
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-orange-50">
              After years of stalled dependency-upgrade attempts and contributor
              churn, CodeRabbit’s new agentic Discord bot turned the project’s
              biggest maintenance burden into a reviewed, 107-file change.
            </p>
            <p className="mt-5 text-base font-semibold text-orange-100">
              By Indopan · Creator and maintainer of Saddlebag Exchange ·
              CodeRabbit team member since 2024
            </p>
          </header>

          <div className="px-6 py-10 sm:px-10">
            <section
              className="grid gap-4 sm:grid-cols-3"
              aria-label="Upgrade results">
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">5+</p>
                <p className="mt-1 font-semibold text-slate-700">
                  years of an OSS project to maintain
                </p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">107</p>
                <p className="mt-1 font-semibold text-slate-700">
                  files in the final upgrade review
                </p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">1</p>
                <p className="mt-1 font-semibold text-slate-700">
                  morning from stuck to shipped
                </p>
              </div>
            </section>

            <div className="mt-12 space-y-6 text-lg leading-relaxed text-slate-700">
              <h2 className="pt-2 text-3xl font-black leading-tight text-slate-900">
                The part of the story every OSS maintainer knows
              </h2>
              <p className="leading-relaxed">
                I created Saddlebag Exchange more than five years ago. It is an
                open-source market data platform for Final Fantasy XIV, World of
                Warcraft, and Guild Wars 2—and it has survived because the
                community keeps finding it useful.
              </p>
              <p className="leading-relaxed">
                But useful open-source projects collect history. They collect
                original package choices, old framework assumptions, legacy
                build tooling, and the kind of frontend debt that stays quiet
                until the day an upgrade touches everything at once.
              </p>
              <p className="leading-relaxed">
                I am still the creator and maintainer, but the contributor
                roster has changed constantly. People would come in, make a few
                helpful pull requests, and eventually take on the frontend
                upgrade. They would spend a week or two fighting it, get
                frustrated, and drift away. Then the next person would inherit
                the same wall.
              </p>
              <p className="leading-relaxed">
                That is the part that hurts. The upgrade was not just a backlog
                item; it was actively contributing to developer attrition. A
                project with enough accumulated debt can make willing
                contributors feel like they have failed it, even when the real
                problem is that the work is too broad for any one person to pick
                up without deep context.
              </p>

              <blockquote className="not-prose my-10 rounded-r-2xl border-l-8 border-orange-500 bg-slate-900 px-6 py-7 text-xl italic leading-relaxed text-white shadow-lg sm:px-8">
                <p>
                  “Yea the discord bot is fire. I was stuck trying to upgrade my
                  FE packages for like... an embarrassing amount of years.
                  Multiple OSS devs attempted and failed to upgrade my packages.
                  CR discord bot was able to do it in a 107 file change review
                  😅”
                </p>
                <footer className="mt-4 text-base font-bold not-italic text-orange-300">
                  — Indopan, creator and maintainer of Saddlebag Exchange
                </footer>
              </blockquote>

              <h2 className="pt-4 text-3xl font-black leading-tight text-slate-900">
                Why CodeRabbit was already part of my workflow
              </h2>
              <p className="leading-relaxed">
                In 2023, as GitHub Copilot and ChatGPT were taking off, I was
                looking for an AI tool that natively lived inside GitHub. That
                search led me to CodeRabbit. Saddlebag Exchange has relied on
                its reviews as part of development for years.
              </p>
              <p className="leading-relaxed">
                When I got access to try the new CodeRabbit agentic bot with
                Saddlebag Exchange, I gave it the project that had worn out so
                many otherwise helpful contributors. Instead of asking someone
                to rebuild five years of repository context from scratch, I
                could describe the problem in the conversation and let the bot
                begin with the codebase itself.
              </p>

              <h2 className="pt-4 text-3xl font-black leading-tight text-slate-900">
                From years stuck to one morning of progress
              </h2>
              <p className="leading-relaxed">
                In one morning, the bot turned the old upgrade from a recurring
                frustration into a real, reviewable change. This was not a tiny
                patch or a lockfile-only upgrade. The finished work spanned 107
                files and crossed the places big frontend upgrades always reach:
                routes, client hydration, server-only sessions, UI components,
                build configuration, tests, and deployment setup.
              </p>
              <p className="leading-relaxed">
                The value was the full loop, not just code generation. The bot
                could inspect the repository, make the upgrade, run checks,
                validate the production build, and keep responding when review
                comments exposed the next edge case.
              </p>
              <ul className="list-disc space-y-3 pl-6 marker:text-orange-500">
                <li>
                  map the dependency and runtime constraints already present in
                  the repository;
                </li>
                <li>
                  upgrade the frontend stack and migrate the code affected by
                  that change;
                </li>
                <li>
                  separate server-only session logic from browser-safe modules;
                </li>
                <li>
                  verify interactive behavior such as navigation, search,
                  notifications, and help controls;
                </li>
                <li>
                  run formatting, focused tests, and a production build; and
                </li>
                <li>
                  respond to inline review feedback with follow-up fixes instead
                  of abandoning the branch after the first draft.
                </li>
              </ul>

              <h2 className="pt-4 text-3xl font-black leading-tight text-slate-900">
                The upgrade was the problem. The maintainer outcome was bigger.
              </h2>
              <p className="leading-relaxed">
                The merged upgrade modernized the project’s Node runtime, Remix,
                React, Tailwind CSS, Vite, Vitest, and supporting packages. It
                also fixed the less-visible problems that make large dependency
                upgrades dangerous: client hydration, browser/server boundaries,
                route behavior, test compatibility, and production build
                configuration.
              </p>
              <p className="leading-relaxed">
                The immediate win was a reviewable pull request with 107 changed
                files, passing focused tests, a successful production build, and
                follow-through on inline comments. The lasting win is that
                Saddlebag Exchange is no longer carrying that same upgrade as a
                trap for the next person who wants to help.
              </p>

              <h2 className="pt-4 text-3xl font-black leading-tight text-slate-900">
                Why the Discord agent matters for open source
              </h2>
              <p className="leading-relaxed">
                In OSS, the hard part is often not finding people who care. It
                is making it possible for those people to contribute without
                first becoming the project historian. Discord is already where
                people report bugs, ask questions, share context, and coordinate
                work. A repository-aware coding agent in that conversation gives
                a maintainer an extra set of hands exactly where the project is
                already alive.
              </p>
              <p className="leading-relaxed">
                That is why I think CodeRabbit’s Discord bot is such a big deal
                for open-source maintainers. It can help explain the codebase,
                investigate failures, plan a safe change, implement it, and stay
                engaged through review. CodeRabbit offers the Discord bot free
                for open-source communities, which makes it practical to try on
                the exact project that has been waiting for help.
              </p>
            </div>

            <section className="mt-12 rounded-2xl bg-slate-900 px-6 py-9 text-center text-white sm:px-10">
              <h2 className="text-3xl font-black">
                Your hardest OSS problem does not have to stay stuck
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                Bring CodeRabbit into your Discord server and give the problem
                that keeps wearing contributors out another shot.
              </p>
              <a
                className="mt-7 inline-flex rounded-full bg-orange-500 px-7 py-3 text-lg font-bold text-white no-underline shadow-lg transition hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300"
                href={CODERABBIT_DISCORD_URL}
                target="_blank"
                rel="noreferrer">
                Add CodeRabbit to Discord for free
              </a>
              <p className="mt-4 text-sm text-slate-400">
                Free for open-source communities.
              </p>
            </section>

            <section className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 px-6 py-9 text-center sm:px-10">
              <h2 className="text-3xl font-black text-slate-900">
                Join the Saddlebag Exchange community
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
                Get market tips, project updates, and help from the community in
                Discord—or support the tools and data that keep Saddlebag
                Exchange running through Patreon.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  className="inline-flex justify-center rounded-full bg-orange-500 px-6 py-3 font-bold text-white no-underline shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  href={SADDLEBAG_DISCORD_URL}
                  target="_blank"
                  rel="noreferrer">
                  Join Saddlebag Discord
                </a>
                <a
                  className="inline-flex justify-center rounded-full border-2 border-orange-500 bg-white px-6 py-3 font-bold text-orange-700 no-underline transition hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  href={SADDLEBAG_PATREON_URL}
                  target="_blank"
                  rel="noreferrer">
                  Support on Patreon
                </a>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}

export default CodeRabbitDiscordUpgrade
