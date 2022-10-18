import type { LoaderFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { useTransition } from 'react'
import type { HistoryResponse } from '~/requests/GetHistory'
import GetHistory from '~/requests/GetHistory'
import type { ListingResponseType } from '~/requests/GetListing'
import GetListing from '~/requests/GetListing'
import { getUserSessionData } from '~/sessions'
import { getItemNameById } from '~/utils/items'

export { ErrorBoundary } from '~/components/utilities/ErrorBoundary'

type ItemPageData =
  | {
      history: HistoryResponse
      listing: ListingResponseType | {}
      itemName: string
    }
  | { exception: string }

export const loader: LoaderFunction = async ({ params, request }) => {
  const itemId = params.itemId
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  }

  const itemName = getItemNameById(itemId)
  if (!itemName) {
    return { exception: 'No item found, please try again' }
  }

  const session = await getUserSessionData(request)

  const world = session.getWorld()
  if (!world) {
    return { exception: 'No world selected, please try again' }
  }

  const itemType = 'all' as const
  const initialDays = 14
  const endDays = 0
  const input = { itemId, world, itemType, initialDays, endDays }

  try {
    const history = await GetHistory(input)
    const listing = await GetListing({
      ...input,
      daysRange: [initialDays, endDays]
    })

    if ('exception' in history) {
      return history
    }

    if ('exception' in listing) {
      return listing
    }
    if ('status' in history && history.status !== 200) {
      return { exception: history.statusText }
    }

    if ('status' in listing && listing.status !== 200) {
      return { exception: listing.statusText }
    }

    return {
      history,
      listing,
      itemName
    }
  } catch (error) {
    if (error instanceof Error) {
      return { exception: error.message }
    } else return { exception: 'Error finding data' }
  }
}

const ItemPage = () => {
  const transition = useTransition()
  const data = useLoaderData<ItemPageData>()

  console.log('transition', transition)

  console.log('data', data)
}

export default ItemPage
