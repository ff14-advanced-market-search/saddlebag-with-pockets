import type { LoaderFunction } from '@remix-run/cloudflare'
import { ffxivItemsMap } from '~/utils/items/ffxivItems'
import { wowItemsMap } from '~/utils/items/wowItems'

// Helper to format dates in W3C format (YYYY-MM-DDThh:mm:ss+00:00)
const toW3CDate = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

// Helper to get last modified date for an item
const getItemLastMod = (_id: string, _type: 'ffxiv' | 'wow'): string => {
  // TODO: Implement actual last modified date lookup from your database
  // For now, we'll use a more realistic approach - weekly updates
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return toW3CDate(lastWeek)
}

export const loader: LoaderFunction = async () => {
  const baseURL = 'https://saddlebagexchange.com'
  const currentDate = toW3CDate(new Date())

  // Get arrays of item IDs without labels
  const ffxivItemIDs = Object.keys(ffxivItemsMap)
  const wowItemIDs = Object.keys(wowItemsMap)

  // Generate URLs with dynamic parameters for WoW items
  const dynamicWoWURLs = wowItemIDs.map((id) => {
    return {
      url: `${baseURL}/wow/item-data/${id}`,
      lastmod: getItemLastMod(id, 'wow')
    }
  })

  // Generate URLs with dynamic parameters for FFXIV items
  const dynamicFFXIVURLs = ffxivItemIDs.map((id) => {
    return {
      url: `${baseURL}/queries/item-data/${id}`,
      lastmod: getItemLastMod(id, 'ffxiv')
    }
  })

  const Sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Core Pages -->
<url>
  <loc>https://saddlebagexchange.com/</loc>
  <lastmod>2024-06-21T00:27:48+00:00</lastmod>
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
<url>
  <loc>https://saddlebagexchange.com/blog/wow/tldr</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/undercut</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r1</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/crossrealm1</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r2</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/howtoresell</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r3</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs1</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs2</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs3</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs4</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs5</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs6</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs7</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs8</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs9</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs10</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs11</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs12</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs13</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs14</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs15</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs16</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs17</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/advanced-strategies</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/advanced-crafting</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/mmo/economics-theory</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/trading/automation-tools</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/skycoach</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/market-mastery</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/market-domination</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/mmo/future-economies</loc>
  <lastmod>2025-06-13T00:27:48+00:00</lastmod>
  <priority>0.70</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/scrip-exchange</loc>
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
<!-- Dynamic Item Pages - Prioritized for Indexing -->
${dynamicWoWURLs
  .map(
    (item) => `
<url>
  <loc>${item.url}</loc>
  <lastmod>${item.lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.90</priority>
</url>`
  )
  .join('\n')}
${dynamicFFXIVURLs
  .map(
    (item) => `
<url>
  <loc>${item.url}</loc>
  <lastmod>${item.lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.90</priority>
</url>`
  )
  .join('\n')}
</urlset>`

  return new Response(Sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  })
}
