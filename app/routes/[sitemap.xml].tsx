import type { LoaderFunction } from '@remix-run/cloudflare'
import { blogPosts } from '~/content/blog/posts'

// Helper to format dates in W3C format (YYYY-MM-DDThh:mm:ss+00:00)
const toW3CDate = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

const getBlogPath = (post: (typeof blogPosts)[string]): string =>
  post.category ? `/blog/${post.category}/${post.slug}` : `/blog/${post.slug}`

export const loader: LoaderFunction = async () => {
  const baseURL = 'https://saddlebagexchange.com'
  const currentDate = toW3CDate(new Date())

  const blogUrls = Object.values(blogPosts)
    .sort((a, b) => getBlogPath(a).localeCompare(getBlogPath(b)))
    .map(
      (post) => `<url>
  <loc>${baseURL}${getBlogPath(post)}</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>0.70</priority>
</url>`
    )
    .join('\n')

  const Sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Core Pages -->
<url>
  <loc>https://saddlebagexchange.com/</loc>
  <lastmod>2026-01-01T00:27:48+00:00</lastmod>
  <priority>1.00</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/itemlist</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>0.90</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/itemlist</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>0.90</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/gw2/itemlist</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>0.90</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/gw2/marketshare/recommended</loc>
  <lastmod>2026-01-01T00:27:48+00:00</lastmod>
  <priority>0.90</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/recommended</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/best-deals/recommended</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/marketshare/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/craftsim/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/shopping-list</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/listings</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/item-history</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/self-purchase</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/undercut</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/price-sniper</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/allagan-data</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/best-deals/recommended</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/upload-timers</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/marketshare/recommended</loc>
  <lastmod>2024-06-21T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortage-predictor</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/legacy-marketshare</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/price-alert</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/region-undercut</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/full-scan</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortages/commodities</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortages/single</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/toekneeatx-flipping-lists</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/options</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/weekly-price-group-delta</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/weekly-price-group-delta</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/pet-marketshare</loc>
  <lastmod>2024-05-11T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
${blogUrls}
<url>
  <loc>https://saddlebagexchange.com/ffxiv/scrip-exchange</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/gc-seals-exchange</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/gc-seal-crafting</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/extended-history</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://docs.saddlebagexchange.com/docs</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://docs.saddlebagexchange.com/redoc</loc>
  <lastmod>2024-07-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
</urlset>`

  return new Response(Sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  })
}
