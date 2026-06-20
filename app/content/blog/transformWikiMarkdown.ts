import wikiPageMeta from './wikiPageMeta.json'
import { wikiPages, wikiPagesBySlug } from './wikiPages'

function toSlug(name: string): string {
  return name
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const wikiLinkTargets: Record<string, string> = {
  'Temp-%E2%80%90-How-to-use-FFXIV-Shopping-List':
    'https://saddlebagexchange.com/ffxiv/shopping-list',
  'Temp-‐-How-to-use-FFXIV-Shopping-List':
    'https://saddlebagexchange.com/ffxiv/shopping-list',
  'How-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard-using-Saddlebag-Exchange-Import-Searches':
    '/blog/ffxiv/howtoresell',
  'A-general-guide-on-how-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard':
    '/blog/r1',
  'How-to-trade-using-our-FFXIV-Market-Overview': '/blog/r2',
  'A-Crafters-Guide-for-using-"Commodity-Shortage-Futures"': '/blog/r3',
  'TLDR:-How-to-earn-gil-with-cross-server-trading': '/blog/ffxiv/tldr',
  'TLDR:-How-to-earn-gold-with-cross-realm-trading': '/blog/wow/tldr',
  'How-to-find-the-item-id-of-any-item-in-FFXIV?':
    'https://saddlebagexchange.com/ffxiv',
  'How-to-find-the-item-id-of-any-item-in-FFXIV%3F':
    'https://saddlebagexchange.com/ffxiv',
  'Repo-Architecture-%E2%80%90--app-routes': '/blog/dev/repo-architecture'
}

for (const page of wikiPages) {
  const wikiPageName = page.wikiFile.replace(/\.md$/, '')
  const localPath = `/blog/${page.category}/${page.slug}`

  wikiLinkTargets[wikiPageName] = localPath
  wikiLinkTargets[page.slug] = localPath
  wikiLinkTargets[encodeURIComponent(wikiPageName)] = localPath
  wikiLinkTargets[encodeURIComponent(page.slug)] = localPath
}

function normalizeWikiPageName(raw: string): string {
  return decodeURIComponent(raw.replace(/ /g, '-'))
}

function resolveWikiLink(pageRef: string, anchor = ''): string | null {
  const normalized = normalizeWikiPageName(pageRef)
  const direct =
    wikiLinkTargets[normalized] ??
    wikiLinkTargets[pageRef] ??
    wikiLinkTargets[encodeURIComponent(normalized)] ??
    wikiLinkTargets[toSlug(normalized)]

  if (direct) return `${direct}${anchor}`

  const slugMatch = wikiPagesBySlug[toSlug(normalized)]
  if (slugMatch) {
    return `/blog/${slugMatch.category}/${slugMatch.slug}${anchor}`
  }

  return null
}

function convertHtmlImages(markdown: string): string {
  return markdown.replace(
    /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
    (_match, src) => {
      const altMatch = _match.match(/alt=["']([^"']*)["']/i)
      const alt = altMatch?.[1] || 'Guide screenshot'
      return `\n\n![${alt}](${src})\n\n`
    }
  )
}

function rewriteWikiLinks(markdown: string): string {
  return markdown.replace(
    /https:\/\/github\.com\/ff14-advanced-market-search\/saddlebag-with-pockets\/wiki\/([^)\s]+?)(#[^)\s]*)?(?=[)\s]|$)/gi,
    (fullMatch, pageRef, anchor = '') => {
      const resolved = resolveWikiLink(pageRef, anchor)
      if (!resolved) return fullMatch
      return resolved
    }
  )
}

function fixTempUrls(markdown: string): string {
  return markdown
    .replace(
      /https:\/\/temp\.saddlebagexchange\.com\/megaitemnames/g,
      'https://saddlebagexchange.com/wow/itemlist'
    )
    .replace(
      /https:\/\/temp\.saddlebagexchange\.com/g,
      'https://saddlebagexchange.com'
    )
}

function convertLinkedLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+\[([^\]]+)\]\(([^)]+)\)\s*\n+/m, '[$1]($2)\n\n')
}

function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/m, '')
}

function fixMarkdownArtifacts(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\(([^)]+)\)``+/g, '![$1]($2)')
    .replace(/\\\*\\\*/g, '**')
    .replace(/\*\*The bot needs/g, '**The bot needs')
}

function fixBareUrlLines(markdown: string): string {
  return markdown.replace(
    /^(https?:\/\/[^\s]+)$/gm,
    (url) => `[${url}](${url})`
  )
}

function fixListUrls(markdown: string): string {
  return markdown.replace(
    /^(\s*[-*]\s+)(https?:\/\/[^\s]+)$/gm,
    (_match, prefix, url) => {
      const label = url.includes('saddlebagexchange.com')
        ? url.replace('https://saddlebagexchange.com', 'saddlebagexchange.com')
        : url.replace(/^https?:\/\//, '')
      return `${prefix}[${label}](${url})`
    }
  )
}

function fixYoutubeImageLinks(markdown: string): string {
  return markdown.replace(
    /!\[[^\]]*\]\((https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^)]+)\)/g,
    '[$1]($1)'
  )
}

function prependHeadingIfMissing(markdown: string, slug: string): string {
  if (/^#\s+/m.test(markdown.trim())) return markdown

  const meta = wikiPageMeta[slug as keyof typeof wikiPageMeta]
  if (!meta) return markdown

  return `# ${meta.title}\n\n${markdown}`
}

export function transformWikiMarkdown(markdown: string, slug: string): string {
  let content = markdown.replace(/\r\n/g, '\n').trim()
  content = convertHtmlImages(content)
  content = rewriteWikiLinks(content)
  content = fixTempUrls(content)
  content = fixYoutubeImageLinks(content)
  content = fixBareUrlLines(content)
  content = fixListUrls(content)
  content = fixMarkdownArtifacts(content)
  content = prependHeadingIfMissing(content, slug)
  content = convertLinkedLeadingH1(content)
  content = stripLeadingH1(content)
  return content.trim()
}
