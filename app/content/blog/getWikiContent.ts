import { transformWikiMarkdown } from './transformWikiMarkdown'
import { wikiContentBySlug } from './wikiContentMap'
import { wikiPagesBySlug } from './wikiPages'

export function getWikiMarkdown(slug: string): string | undefined {
  const page = wikiPagesBySlug[slug]
  if (!page) return undefined

  const raw = wikiContentBySlug[slug]
  if (!raw) return undefined

  return transformWikiMarkdown(raw, slug)
}
