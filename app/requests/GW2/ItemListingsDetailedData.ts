import { address, UserAgent } from '~/requests/client/config'

interface ItemListingsDetailedProps {
  itemID: number
}

// Re-export types from ItemListingsData since they're the same
export type {
  BuyOrder,
  SellOrder,
  TimeDataPoint,
  ExtraData,
  ItemListingData,
  ItemListingResponse
} from './ItemListingsData'

const ItemListingsDetailedData: (
  props: ItemListingsDetailedProps
) => Promise<Response> = async ({ itemID }) => {
  return fetch(`${address}/api/gw2/listings-detailed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      itemID
    })
  })
}

export default ItemListingsDetailedData
