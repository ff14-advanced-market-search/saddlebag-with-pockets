import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import WikiBlog from '~/components/blog/WikiBlog'
import { blogComponents, blogMetaFunctions } from '~/components/blog'
import { getWikiMarkdown } from '~/content/blog/getWikiContent'
import { blogPosts } from '~/content/blog/posts'

interface LoaderData {
  post: (typeof blogPosts)[string]
  componentName: string
  wikiMarkdown?: string
}

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { category, slug } = params

  if (!category || !slug) {
    throw new Response('Missing category or slug', { status: 400 })
  }

  const postKey = `${category}/${slug}`
  const post = blogPosts[postKey]

  if (!post) {
    throw new Response('Blog post not found', { status: 404 })
  }

  const wikiMarkdown =
    post.component === 'WikiBlog' && post.wikiSlug
      ? getWikiMarkdown(post.wikiSlug)
      : undefined

  if (post.component === 'WikiBlog' && !wikiMarkdown) {
    throw new Response('Wiki blog content not found', { status: 404 })
  }

  return {
    post,
    componentName: post.component,
    wikiMarkdown
  } as LoaderData
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Blog Post Not Found' },
      { name: 'description', content: 'This blog post could not be found.' }
    ]
  }

  const { post, componentName } = data

  const componentMeta = blogMetaFunctions[componentName]
  if (componentMeta && typeof componentMeta === 'function') {
    return componentMeta()
  }

  return [
    { title: post.title },
    { name: 'description', content: post.description },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.description },
    ...(post.canonical
      ? [
          {
            tagName: 'link',
            rel: 'canonical',
            href: post.canonical
          }
        ]
      : [])
  ]
}

export default function BlogCategorySlugRoute() {
  const { post, componentName, wikiMarkdown } = useLoaderData<LoaderData>()

  if (post.component === 'WikiBlog' && wikiMarkdown) {
    return <WikiBlog title={post.title} markdown={wikiMarkdown} />
  }

  const Component = blogComponents[componentName]

  if (!Component) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Component not found
          </h1>
          <p>
            The component "{componentName}" is not registered in the blog
            components registry.
          </p>
        </div>
      </div>
    )
  }

  return <Component />
}
