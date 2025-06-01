import { LoaderFunction } from '@remix-run/cloudflare'

export const loader: LoaderFunction = () => {
  const robotText = `
  User-agent: *
  Allow: /
  Allow: /ffxiv
  Allow: /queries
  Allow: /wow
  Allow: /blog/*
  Allow: /options
  Allow: /queries/item-data/*
  Allow: /wow/item-data/*
  Allow: /ffxiv/itemlist
  Allow: /wow/itemlist
  Allow: /queries/recommended
  Allow: /ffxiv/marketshare/queries
  Allow: /ffxiv/craftsim/queries
  Allow: /ffxiv/shopping-list
  Allow: /queries/listings
  Allow: /queries/item-history
  Allow: /ffxiv/self-purchase
  Allow: /undercut
  Allow: /price-sniper
  Allow: /allagan-data
  Allow: /wow/best-deals/recommended
  Allow: /wow/upload-timers
  Allow: /wow/marketshare/recommended
  Allow: /wow/shortage-predictor
  Allow: /wow/legacy-marketshare
  Allow: /wow/price-alert
  Allow: /wow/region-undercut
  Allow: /wow/full-scan
  Allow: /wow/shortages/commodities
  Allow: /wow/shortages/single
  Allow: /wow/pet-marketshare
  Allow: /wow/weekly-price-group-delta
  Allow: /ffxiv/scrip-exchange
  Allow: /ffxiv/extended-history
  Allow: /ffxiv/best-deals/recommended
  Allow: /ffxiv/weekly-price-group-delta

  Disallow: /nogooglebot/
  Disallow: /build/
  Disallow: /queries/full-scan
  Disallow: /ffxiv/marketshare
  Disallow: /ffxiv/craftsim
  Disallow: /ffxiv/shortage-predictor
  Disallow: /ffxiv/best-deals
  Disallow: /wow/best-deals
  Disallow: /wow/export-search
  Disallow: /wow/marketshare
  Disallow: /wow/shopping-list
  Disallow: /wow/out-of-stock
  Disallow: /queries/world-comparison
  Disallow: /wow/ilvl-shopping-list
  Disallow: /wow/ilvl-export-search
  Disallow: /wow/quantity-manipulation
  Disallow: /wow/weekly-price-group-delta-recommended

  Sitemap: https://saddlebagexchange.com/sitemap.xml
  `
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
