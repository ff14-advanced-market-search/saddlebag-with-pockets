import { LoaderFunction } from '@remix-run/cloudflare'

export const loader: LoaderFunction = () => {
  const robotText = `
  User-agent: Googlebot
  Disallow: /nogooglebot/

  User-agent: *
  Allow: /

  Sitemap: https://saddlebagexchange.com/sitemap.xml
  `
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
