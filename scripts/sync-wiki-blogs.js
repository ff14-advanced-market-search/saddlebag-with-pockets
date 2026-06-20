/**
 * Sync GitHub wiki markdown into local blog content.
 * Usage: node scripts/sync-wiki-blogs.js
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const repoRoot = path.join(__dirname, '..')
const wikiDir = path.join(repoRoot, '.wiki-cache')
const outDir = path.join(repoRoot, 'app/content/blog/wiki')

const skipFiles = new Set([
  'Home.md',
  'FFXIV-Item-List.md',
  'WoW-Item-List.md',
  'History-API-output-examples.md',
  'TLDR:-How-to-earn-gil-with-cross-server-trading.md',
  'TLDR:-How-to-earn-gold-with-cross-realm-trading.md',
  'How-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard-using-Saddlebag-Exchange-Import-Searches.md',
  'A-general-guide-on-how-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard.md',
  'How-to-trade-using-our-FFXIV-Market-Overview.md',
  'A-Crafters-Guide-for-using-"Commodity-Shortage-Futures".md'
])

const excludedSlugs = new Set([
  'stickys-bot',
  'ffxiv-job-category-ids',
  'how-to-travel-to-russian-realms-on-eu-region',
  'showcase-screenshots',
  'how-to-setup-mega-alerts-standalone-blizzard-api-sniper',
  'ffxiv-sale-alerts',
  'temp-how-to-use-ffxiv-shopping-list',
  'how-to-update-mega-alerts-in-pycharm',
  'repo-architecture-app-routes',
  'getting-item-names',
  'how-to-attach-your-discord-user-to-your-patreon-user',
  'api-call-guide-part-2-wow-api',
  'api-call-guide'
])

function toSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function guessCategory(filename) {
  const lower = filename.toLowerCase()
  if (
    lower.startsWith('wow-') ||
    lower.includes('wow-') ||
    lower.includes('mega-alerts') ||
    lower.includes('blizzard')
  ) {
    return 'wow'
  }
  if (
    lower.startsWith('ffxiv-') ||
    lower.includes('ffxiv') ||
    lower.includes('allagan') ||
    lower.includes('universalis') ||
    lower.includes('craftsim') ||
    (lower.includes('undercut') && !lower.includes('wow'))
  ) {
    return 'ffxiv'
  }
  if (lower.includes('gw2')) return 'gw2'
  if (
    lower.includes('repo') ||
    lower.includes('api-call') ||
    lower.includes('swagger') ||
    lower.includes('architecture')
  ) {
    return 'dev'
  }
  return 'guides'
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1].replace(/\\/g, '').trim()
  const firstLine = content
    .split('\n')
    .find((l) => l.trim() && !l.startsWith('```'))
  return firstLine
    ? firstLine
        .replace(/^#+\s*/, '')
        .trim()
        .slice(0, 120)
    : 'Wiki Guide'
}

function extractDescription(content, title) {
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('- [')
    ) {
      continue
    }
    const text = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
    if (text.length > 20) return text.slice(0, 160)
  }
  return `Guide: ${title}`
}

if (!fs.existsSync(wikiDir)) {
  execSync(
    'git clone --depth 1 https://github.com/ff14-advanced-market-search/saddlebag-with-pockets.wiki.git .wiki-cache',
    { cwd: repoRoot, stdio: 'inherit' }
  )
} else {
  execSync('git pull', { cwd: wikiDir, stdio: 'inherit' })
}

fs.mkdirSync(outDir, { recursive: true })

const pages = []
for (const file of fs.readdirSync(wikiDir).filter((f) => f.endsWith('.md'))) {
  if (skipFiles.has(file)) continue
  const wikiContent = fs.readFileSync(path.join(wikiDir, file), 'utf8')
  if (wikiContent.trim().length < 10) continue
  const slug = toSlug(file)
  if (excludedSlugs.has(slug)) continue
  const outName = `${slug}.md`
  fs.copyFileSync(path.join(wikiDir, file), path.join(outDir, outName))
  pages.push({
    slug,
    file: outName,
    category: guessCategory(file),
    title: extractTitle(wikiContent),
    description: extractDescription(wikiContent, extractTitle(wikiContent)),
    wikiFile: file
  })
}

pages.sort(
  (a, b) =>
    a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
)

fs.writeFileSync(
  path.join(repoRoot, 'app/content/blog/wikiPages.ts'),
  `/** Auto-generated from GitHub wiki – run scripts/sync-wiki-blogs.js */\n\nexport interface WikiPage {\n  slug: string\n  file: string\n  category: string\n  title: string\n  description: string\n  wikiFile: string\n}\n\nexport const wikiPages: WikiPage[] = ${JSON.stringify(
    pages,
    null,
    2
  )}\n\nexport const wikiPagesBySlug: Record<string, WikiPage> = Object.fromEntries(\n  wikiPages.map(page => [page.slug, page])\n)\n`
)

const entries = pages
  .map(
    (p) => `  '${p.category}/${p.slug}': {
    category: ${JSON.stringify(p.category)},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    description: ${JSON.stringify(p.description)},
    component: 'WikiBlog',
    wikiSlug: ${JSON.stringify(p.slug)},
    canonical: ${JSON.stringify(
      `https://saddlebagexchange.com/blog/${p.category}/${p.slug}`
    )}
  }`
  )
  .join(',\n')

fs.writeFileSync(
  path.join(repoRoot, 'app/content/blog/wikiPostsEntries.ts'),
  `/** Auto-generated from GitHub wiki – run scripts/sync-wiki-blogs.js */\n\nexport const wikiBlogPosts: Record<\n  string,\n  {\n    category: string\n    slug: string\n    title: string\n    description: string\n    component: string\n    wikiSlug: string\n    canonical: string\n  }\n> = {\n${entries}\n}\n`
)

const importLines = []
const mapLines = []
for (const page of pages) {
  const content = fs.readFileSync(path.join(outDir, page.file), 'utf8')
  mapLines.push(`  ${JSON.stringify(page.slug)}: ${JSON.stringify(content)}`)
}

fs.writeFileSync(
  path.join(repoRoot, 'app/content/blog/wikiContentMap.ts'),
  `/** Auto-generated from GitHub wiki – run scripts/sync-wiki-blogs.js */\n\nexport const wikiContentBySlug: Record<string, string> = {\n${mapLines.join(
    ',\n'
  )}\n}\n`
)

console.log(`Synced ${pages.length} wiki pages`)
