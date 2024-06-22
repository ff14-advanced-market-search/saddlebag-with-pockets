import { LoaderFunction } from '@remix-run/cloudflare'
import { ffxivItemsMap } from '~/utils/items/ffxivItems'
import { wowItemsMap } from '~/utils/items/wowItems'

export const loader: LoaderFunction = async () => {
  const baseURL = 'https://saddlebagexchange.com'

  // // # can change this back to a dynamic date if thats better
  const currentDate = new Date().toISOString()

  // # then use this
  // <url>
  //   <loc>https://saddlebagexchange.com/</loc>
  //   <lastmod>${currentDate}</lastmod>
  //   <priority>1.00</priority>
  // </url>

  // Get arrays of item IDs without labels
  const ffxivItemIDs = Object.keys(ffxivItemsMap)
  const wowItemIDs = Object.keys(wowItemsMap)

  // Generate URLs with dynamic parameters for WoW items
  const dynamicWoWURLs = wowItemIDs.map((id) => {
    return `${baseURL}/wow/item-data/${id}`
  })

  // Generate URLs with dynamic parameters for FFXIV items
  const dynamicFFXIVURLs = ffxivItemIDs.map((id) => {
    return `${baseURL}/queries/item-data/${id}`
  })

  const Sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
  <loc>https://saddlebagexchange.com/</loc>
  <lastmod>2024-06-21T00:27:48+00:00</lastmod>
  <priority>1.00</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/itemlist</loc>
  <lastmod>2024-05-10T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/itemlist</loc>
  <lastmod>2024-05-10T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/recommended</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/marketshare/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/craftsim/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/shopping-list</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/listings</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/item-history</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/self-purchase</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/world-comparison</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/undercut</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/price-sniper</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/allagan-data</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/best-deals/recommended</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/upload-timers</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shopping-list</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/export-search</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/marketshare</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortage-predictor</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/legacy-marketshare</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/price-alert</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/region-undercut</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/full-scan</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortages/commodities</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/shortages/single</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/options</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/queries/full-scan</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/marketshare</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/ffxiv/craftsim</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/best-deals</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/wow/pet-marketshare</loc>
  <lastmod>2024-05-11T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/tldr</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r1</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/wow/crossrealm1</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r2</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/howtoresell</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/r3</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs1</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs2</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs3</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs4</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs5</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs6</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs7</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs8</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs9</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs10</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs11</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs12</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs13</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs14</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
<url>
  <loc>https://saddlebagexchange.com/blog/ffxiv/bs15</loc>
  <lastmod>2024-05-07T00:27:48+00:00</lastmod>
  <priority>0.80</priority>
</url>
${dynamicWoWURLs
  .map(
    (url) => `
<url>
  <loc>${url}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>0.80</priority>
</url>`
  )
  .join('\n')}
${dynamicFFXIVURLs
  .map(
    (url) => `
<url>
  <loc>${url}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>0.80</priority>
</url>`
  )
  .join('\n')}
</urlset>`
  return new Response(Sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
