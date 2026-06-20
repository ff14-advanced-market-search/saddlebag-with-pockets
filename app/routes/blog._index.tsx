import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import type { MetaFunction } from '@remix-run/cloudflare'
import { blogPosts, featuredPosts } from '~/content/blog/posts'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange Blogs, posts and random stuff' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'Saddlebag Exchange best blogs and guides are all on github'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog'
    }
  ]
}

const featuredHrefs = new Set(featuredPosts.map((post) => post.href))

const recommendedQueries = [
  ...featuredPosts,
  ...Object.values(blogPosts)
    .filter((post) => {
      const href = post.category
        ? `/blog/${post.category}/${post.slug}`
        : `/blog/${post.slug}`
      return !featuredHrefs.has(href)
    })
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((post) => ({
      name: post.title,
      description: post.description,
      Icon: DocumentSearchIcon,
      href: post.category
        ? `/blog/${post.category}/${post.slug}`
        : `/blog/${post.slug}`
    }))
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
                return <TileLink key={query.href} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
