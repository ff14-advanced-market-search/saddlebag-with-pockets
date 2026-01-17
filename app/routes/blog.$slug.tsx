import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { blogPosts } from '~/content/blog/posts'
import { blogComponents, blogMetaFunctions } from '~/components/blog'

interface LoaderData {
  post: (typeof blogPosts)[string]
  componentName: string
}

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { slug } = params

  if (!slug || typeof slug !== 'string') {
    throw new Response('Missing slug', { status: 400 })
  }

  // For research posts, look up directly by slug
  const post = blogPosts[slug]

  if (!post) {
    throw new Response('Blog post not found', { status: 404 })
  }

  return {
    post,
    componentName: post.component
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

  // Use component meta if available, otherwise fallback to post config
  const componentMeta = blogMetaFunctions[componentName]
  if (componentMeta && typeof componentMeta === 'function') {
    return componentMeta()
  }

  // Fallback to post config
  return [
    { title: post.title },
    { name: 'description', content: post.description },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.description },
    ...(post.canonical
      ? [
          {
            rel: 'canonical',
            href: post.canonical
          }
        ]
      : [])
  ]
}

export default function BlogSlugRoute() {
  const { post, componentName } = useLoaderData<LoaderData>()

  // Dynamically get the component from the registry
  const Component = blogComponents[componentName]

  if (!Component) {
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev) {
      console.error(`Blog component not found: ${componentName}`)
      return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-600">
              Content unavailable
            </h1>
            <p>This blog post is currently unavailable.</p>
          </div>
        </div>
      )
    }

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
