// Helper to format dates in W3C format (YYYY-MM-DDThh:mm:ss+00:00)
const toW3CDate = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

export const loader: LoaderFunction = async () => {
  const baseURL = 'https://saddlebagexchange.com'
  const currentDate = toW3CDate(new Date())

  const SitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
  <loc>${baseURL}/sitemap.xml</loc>
  <lastmod>${currentDate}</lastmod>
</sitemap>
<sitemap>
  <loc>${baseURL}/sitemap-wow.xml</loc>
  <lastmod>${currentDate}</lastmod>
</sitemap>
<sitemap>
  <loc>${baseURL}/sitemap-gw2.xml</loc>
  <lastmod>${currentDate}</lastmod>
</sitemap>
<sitemap>
  <loc>${baseURL}/sitemap-ffxiv.xml</loc>
  <lastmod>${currentDate}</lastmod>
</sitemap>
</sitemapindex>`

  return new Response(SitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  })
}
