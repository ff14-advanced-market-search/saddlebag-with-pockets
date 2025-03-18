import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange Blogs, posts and random stuff',
    description: 'Saddlebag Exchange best blogs and guides are all on github'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/blog' }
]

const recommendedQueries = [
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/skycoach'
  },
  {
    name: 'FFXIV Marketboard Guide: Mastering Undercutting with Saddlebag Exchange',
    description:
      'Learn how to maximize your FFXIV gil earnings using undercutting strategies and Saddlebag Exchange alerts. Master the Marketboard with real-time notifications.',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/undercut'
  },
  {
    name: 'How to Cross Server Trade in FFXIV',
    description: 'Watch a youtube video on how to tade between servers',
    Icon: DocumentSearchIcon,
    href: '/blog/r1'
  },
  {
    name: 'How to use ffxiv marketshare',
    description: 'how to marketshare',
    Icon: DocumentSearchIcon,
    href: '/blog/r2'
  },
  {
    name: 'How to use ffxiv reselling',
    description: 'how to reselling',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/howtoresell'
  },
  {
    name: 'How to use wow commodity shortage',
    description: 'how to wow commodity shortage',
    Icon: DocumentSearchIcon,
    href: '/blog/r3'
  },
  {
    name: 'Chatgpt bs ffxiv post 1',
    description: 'Chatgpt bs ffxiv post 1',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs1'
  },
  {
    name: 'Chatgpt bs ffxiv post 2',
    description: 'Chatgpt bs ffxiv post 2',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs2'
  },
  {
    name: 'Chatgpt bs ffxiv post 3',
    description: 'Chatgpt bs ffxiv post 3',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs3'
  },
  {
    name: 'Chatgpt bs ffxiv post 4',
    description: 'Chatgpt bs ffxiv post 4',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs4'
  },
  {
    name: 'Chatgpt bs ffxiv post 5',
    description: 'Chatgpt bs ffxiv post 5',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs5'
  },
  {
    name: 'Chatgpt bs ffxiv post 6',
    description: 'Chatgpt bs ffxiv post 6',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs6'
  },
  {
    name: 'Chatgpt bs ffxiv post 7',
    description: 'Chatgpt bs ffxiv post 7',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs7'
  },
  {
    name: 'Chatgpt bs ffxiv post 8',
    description: 'Chatgpt bs ffxiv post 8',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs8'
  },
  {
    name: 'Chatgpt bs ffxiv post 9',
    description: 'Chatgpt bs ffxiv post 9',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs9'
  },
  {
    name: 'Chatgpt bs ffxiv post 10',
    description: 'Chatgpt bs ffxiv post 10',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs10'
  },
  {
    name: 'Chatgpt bs ffxiv post 11',
    description: 'Chatgpt bs ffxiv post 11',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs11'
  },
  {
    name: 'Chatgpt bs ffxiv post 12',
    description: 'Chatgpt bs ffxiv post 12',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs12'
  },
  {
    name: 'Chatgpt bs ffxiv post 13',
    description: 'Chatgpt bs ffxiv post 13',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs13'
  },
  {
    name: 'Chatgpt bs ffxiv post 14',
    description: 'Chatgpt bs ffxiv post 14',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs14'
  },
  {
    name: 'Chatgpt bs ffxiv post 15',
    description: 'Chatgpt bs ffxiv post 15',
    Icon: 'DocumentSearchIcon',
    href: '/blog/ffxiv/bs15'
  },
  {
    name: 'Our first wow cross realm update',
    description: 'Launch of cross realm trading tools',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/crossrealm1'
  }
]

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              Blogs - WIP
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
