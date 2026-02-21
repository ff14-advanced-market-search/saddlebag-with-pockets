import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/GW2/ItemListingsData'
import ItemListingsData from '~/requests/GW2/ItemListingsData'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Banner from '~/components/Common/Banner'
import ItemDataDisplay from '~/components/GW2Results/ItemData/ItemDataDisplay'

export const ErrorBoundary = () => <ErrorBounds />

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if ('exception' in data) {
    return [
      { charset: 'utf-8' },
      { title: 'Error' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'description', content: `Error: ${data.exception}` }
    ]
  } else {
    const canonicalUrl = `https://saddlebagexchange.com/gw2/item-data/${data.data.itemID}`
    const description = `Guild Wars 2 trading post data for ${data.data.itemName}`
    const title = `${data.data.itemName} – GW2 Trading Post Price Data`
    return [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { title },
      { name: 'description', content: description },
      { tagName: 'link', rel: 'canonical', href: canonicalUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: 'product' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const itemId = params.itemId
  if (!itemId) {
    return json({ exception: 'No item found, please try again' })
  }

  const parsedItemId = parseInt(itemId)
  if (isNaN(parsedItemId)) {
    return json({ exception: 'Invalid item' })
  }

  try {
    const response = await ItemListingsData({
      itemID: parsedItemId
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    if ('exception' in data) {
      return json({ exception: data.exception })
    }
    return json(data)
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

type ResponseType = ItemListingResponse | { exception: string }

export default function Index() {
  const result = useLoaderData<ResponseType>()
  const { darkmode } = useTypedSelector((state) => state.user)

  const listing = 'data' in result ? result.data : undefined

  const error = result && 'exception' in result ? result.exception : undefined

  if (error) {
    return (
      <PageWrapper>
        <h2 className="text-red-800 dark:text-red-200">Error: {error}</h2>
      </PageWrapper>
    )
  }

  if (!Object.keys(result).length) {
    return <NoResults />
  }

  if (listing) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: listing.itemName,
      description: `Guild Wars 2 trading post data for ${listing.itemName}`,
      url: `https://saddlebagexchange.com/gw2/item-data/${listing.itemID}`
    }
    return (
      <PageWrapper>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Banner />
        <ItemDataDisplay
          listing={listing}
          darkmode={darkmode}
          isDetailed={false}
        />
      </PageWrapper>
    )
  }

  return <NoResults />
}
