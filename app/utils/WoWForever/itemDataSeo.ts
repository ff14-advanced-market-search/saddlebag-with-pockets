type MetaTag =
  | { charset: string }
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: 'link'; rel: string; href: string }

export const foreverItemCanonicalUrl = (itemID: number) =>
  `https://saddlebagexchange.com/wow-forever/item-data/${itemID}`

export const foreverItemPageMeta = ({
  itemID,
  itemName
}: {
  itemID: number
  itemName: string
}): MetaTag[] => {
  const href = foreverItemCanonicalUrl(itemID)
  const blurb = `${itemName} WoW Forever auction house price and listing data`
  const heading = `${itemName} – WoW Forever Auction House Data`
  const openGraph = (
    [
      ['og:title', heading],
      ['og:description', blurb],
      ['og:url', href],
      ['og:type', 'product'],
      ['og:site_name', 'Saddlebag Exchange']
    ] as const
  ).map(([property, content]) => ({ property, content }))

  return [
    { charset: 'utf-8' },
    { title: heading },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'description', content: blurb },
    { tagName: 'link', rel: 'canonical', href },
    ...openGraph,
    { name: 'twitter:card', content: 'summary' }
  ]
}

export const foreverItemErrorMeta = (message: string): MetaTag[] => [
  { charset: 'utf-8' },
  { title: 'Error' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { name: 'description', content: `Error: ${message}` }
]

export const foreverItemStructuredData = ({
  itemID,
  itemName,
  minPrice
}: {
  itemID: number
  itemName: string
  minPrice?: number
}) => {
  const href = foreverItemCanonicalUrl(itemID)
  const blurb = `${itemName} WoW Forever auction house price and listing data`
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    description: blurb,
    url: href
  }
  if (minPrice != null && minPrice !== -1) {
    product.offers = {
      '@type': 'AggregateOffer',
      lowPrice: minPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  }

  const trail = [
    { name: 'Home', item: 'https://saddlebagexchange.com' },
    { name: 'WoW Forever', item: 'https://saddlebagexchange.com/wow-forever' },
    { name: itemName, item: href }
  ]

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: step.item
    }))
  }

  return { product, crumbs }
}

export const encodeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', String.raw`\u003c`)
