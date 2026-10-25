import { useLoaderData } from '@remix-run/react'
import { marketGuides } from '~/content/blog/marketGuides'
import WikiBlog from './WikiBlog'

export default function MarketGuide() {
  const { post } = useLoaderData<{
    post: { category: string; slug: string }
  }>()
  const guide =
    marketGuides[`${post.category}/${post.slug}` as keyof typeof marketGuides]

  return <WikiBlog title={guide.title} markdown={guide.markdown} />
}
