
import { gw2ItemsMap } from '~/utils/items/gw2Items'

// Helper to format dates in W3C format (YYYY-MM-DDThh:mm:ss+00:00)
const toW3CDate = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

// Helper to get last modified date for an item
const getItemLastMod = (_id: string): string => {
  // TODO: Implement actual last modified date lookup from your database
  // For now, we'll use a more realistic approach - weekly updates
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return toW3CDate(lastWeek)
}

export const loader: LoaderFunction = async () => {
  const baseURL = 'https://saddlebagexchange.com'

  // Get arrays of item IDs without labels
  const gw2ItemIDs = Object.keys(gw2ItemsMap)

  // Generate URLs with dynamic parameters for GW2 items
  const dynamicGW2URLs = gw2ItemIDs.map((id) => {
    return {
      url: `${baseURL}/gw2/item-data/${id}`,
      lastmod: getItemLastMod(id)
    }
  })

  const Sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Dynamic GW2 Item Pages -->
${dynamicGW2URLs
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
