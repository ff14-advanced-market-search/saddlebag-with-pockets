import { wikiContentBySlug } from './wikiContentMap'
import { wikiPagesBySlug } from './wikiPages'

export function getWikiMarkdown(slug: string): string | undefined {
  const page = wikiPagesBySlug[slug]
  if (!page) return undefined
  return wikiContentBySlug[slug]
}
