import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'

const CODERABBIT_DISCORD_URL = 'https://www.coderabbit.ai/discord'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title: 'How CodeRabbit Discord Unblocked Our Frontend Upgrade'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'How the CodeRabbit Discord bot helped Saddlebag Exchange complete a long-stalled, 107-file frontend dependency upgrade.'
    },
    {
      name: 'customHeading',
      content: 'The Discord Bot That Finally Unblocked Our Frontend Upgrade'
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
              The Discord Bot That Finally Unblocked Our Frontend Upgrade
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-orange-50">
              A dependency upgrade that had defeated multiple attempts became a
              reviewed, tested, 107-file change—all from the place our team was
              already talking.
            </p>
          </header>

          <div className="px-6 py-10 sm:px-10">
            <section
              className="grid gap-4 sm:grid-cols-3"
              aria-label="Upgrade results">
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">107</p>
                <p className="mt-1 font-semibold text-slate-700">
                  files in the upgrade review
                </p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">19/19</p>
                <p className="mt-1 font-semibold text-slate-700">
                  focused tests passing
                </p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-3xl font-black text-orange-600">Years</p>
                <p className="mt-1 font-semibold text-slate-700">
                  of upgrade debt cleared
                </p>
              </div>
            </section>

            <div className="prose prose-lg prose-slate mt-12 max-w-none">
              <h2>When “we should upgrade that” turns into years</h2>
              <p>
                Saddlebag Exchange is an open-source market data platform for
                Final Fantasy XIV, World of Warcraft, and Guild Wars 2. Like a
                lot of useful community projects, it grew while its frontend
                dependency stack stayed frozen. Every year made the eventual
                jump more intimidating: framework changes, runtime changes,
                thousands of lockfile lines, and interactive UI that still had
                to work when everything was done.
              </p>
              <p>
                This was not a one-package version bump. It was the sort of
                upgrade that crosses route loaders, server-only session code,
                client hydration, components, build configuration, tests, and
                deployment tooling. Previous attempts had stalled. The risk and
                review surface were simply too large for a casual cleanup.
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
                  — Saddlebag Exchange developer
                </footer>
              </blockquote>

              <h2>Why doing the work in Discord changed the equation</h2>
              <p>
                The breakthrough was not another isolated code suggestion. The
                CodeRabbit Discord bot joined the actual development
                conversation with access to the repository and the surrounding
                context. We could describe the outcome we needed in normal
                language, inspect progress together, and keep narrowing the work
                without rebuilding context in a new tool every time.
              </p>
              <p>
                From that conversation, the bot could move through the whole
                engineering loop:
              </p>
              <ul>
                <li>
                  inspect the repository and identify the real dependency and
                  runtime constraints;
                </li>
                <li>
                  update the frontend stack and migrate the code affected by
                  those upgrades;
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

              <h2>What shipped</h2>
              <p>
                The merged upgrade modernized the project’s Node runtime, Remix,
                React, Tailwind CSS, Vite, Vitest, and supporting packages. It
                also fixed the less-visible problems that make large dependency
                upgrades dangerous: client hydration, browser/server boundaries,
                route behavior, test compatibility, and production build
                configuration.
              </p>
              <p>
                The result was not “the lockfile changed, good luck.” It was a
                reviewable pull request with 107 changed files, passing focused
                tests, a successful production build, and follow-through on the
                comments that arrived during review.
              </p>

              <h2>An AI teammate where open-source teams already work</h2>
              <p>
                For maintainers, the interface matters. Contributors already
                arrive in Discord to report bugs, ask questions, and coordinate
                work. Putting a repository-aware coding agent in that same
                channel turns a conversation into execution without requiring
                every participant to clone the project, reproduce the local
                environment, or learn a new workflow first.
              </p>
              <p>
                That makes the CodeRabbit Discord bot especially compelling for
                open source: it can help explain a codebase, triage issues,
                investigate failures, plan changes, implement fixes, and carry
                the work through review. CodeRabbit offers the Discord bot free
                for open-source communities, so the barrier to trying it is
                refreshingly low.
              </p>
            </div>

            <section className="mt-12 rounded-2xl bg-slate-900 px-6 py-9 text-center text-white sm:px-10">
              <h2 className="text-3xl font-black">
                Your oldest upgrade does not have to stay stuck
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                Bring CodeRabbit into your Discord server, connect the context
                your community needs, and give that “someday” engineering task
                another shot.
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
          </div>
        </article>
      </div>
    </div>
  )
}

export default CodeRabbitDiscordUpgrade
