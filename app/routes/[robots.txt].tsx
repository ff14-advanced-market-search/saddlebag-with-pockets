import { LoaderFunction } from '@remix-run/cloudflare'

export const loader: LoaderFunction = () => {
  const robotText = `
  User-agent: *
  Allow: /
  Allow: /ffxiv
  Allow: /queries
  Allow: /wow
  Allow: /blog/*
  Allow: /queries/item-data/*
  Allow: /wow/item-data/*

  Disallow: /nogooglebot/
  Disallow: /build/

  Sitemap: https://saddlebagexchange.com/sitemap.xml
  `
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
