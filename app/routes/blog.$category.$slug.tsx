import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { blogPosts } from '~/content/blog/posts'
import { blogComponents, blogMetaFunctions } from '~/components/blog'

interface LoaderData {
  post: (typeof blogPosts)[string]
  componentName: string
}

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { category, slug } = params

  if (!category || !slug) {
    throw new Response('Missing category or slug', { status: 400 })
  }

  // Construct the key based on category and slug
  const postKey = `${category}/${slug}`
  const post = blogPosts[postKey]

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

export default function BlogCategorySlugRoute() {
  const { post, componentName } = useLoaderData<LoaderData>()

  // Dynamically get the component from the registry
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
