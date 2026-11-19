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
}): Array<MetaTag> => {
  const href = foreverItemCanonicalUrl(itemID)
  const blurb = `${itemName} WoW Forever auction house price and listing data`
  const heading = `${itemName} – WoW Forever Auction House Data`
  const tags: Array<MetaTag> = [{ charset: 'utf-8' }, { title: heading }]
  tags.push({ name: 'viewport', content: 'width=device-width,initial-scale=1' })
  tags.push({ name: 'description', content: blurb })
  tags.push({ tagName: 'link', rel: 'canonical', href })
  for (const [property, content] of [
    ['og:title', heading],
    ['og:description', blurb],
    ['og:url', href],
    ['og:type', 'product'],
    ['og:site_name', 'SaddleBag Exchange']
  ] as const) {
    tags.push({ property, content })
  }
  tags.push({ name: 'twitter:card', content: 'summary' })
  return tags
}

export const foreverItemErrorMeta = (message: string): Array<MetaTag> => [
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
  JSON.stringify(value).replaceAll('<', '\u003c')
