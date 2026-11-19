import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { loader } from '~/routes/wow-forever.item-data.$itemId'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'

const originalFetch = global.fetch

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  global.fetch = originalFetch
})

test('loader posts Forever bulk-listings with home AH from session defaults', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        '2840': {
          itemID: 2840,
          itemName: 'Copper Bar',
          minPrice: 0.38,
          historicPrice: 5,
          salesPerDay: 12.5,
          listingData: [{ price: 0.38, quantity: 20 }],
          currentQuantity: 20,
          avgQuantity: -1,
          currentVsAvgQuantityPercent: 100,
          quantityState: 'stable',
          currentMarketValue: 4,
          historicMarketValue: 62,
          percentChange: -92.4,
          priceTimeData: [],
          quantityTimeData: [],
          state: 'crashing',
          link: 'https://saddlebagexchange.com/wow-forever/item-data/2840',
          auctionHouseId: 111,
          auctionHouseName: 'Alliance Auction House',
          faction: 'alliance'
        }
      }
    })
  })
  global.fetch = fetchMock as typeof fetch

  const result = await loader({
    request: new Request(
      'https://saddlebagexchange.com/wow-forever/item-data/2840'
    ),
    params: { itemId: '2840' },
    context: {}
  })

  expect(fetchMock).toHaveBeenCalledTimes(1)
  const [url, init] = fetchMock.mock.calls[0]
  expect(String(url)).toContain('/api/wow/forever/bulk-listings')
  expect(init?.method).toBe('POST')
  const body = JSON.parse(String(init?.body))
  expect(body).toEqual({
    discord_consent: WOW_DISCORD_CONSENT,
    auctionHouseId: 111,
    region: 'NA',
    itemIDs: [2840]
  })
  expect(result).toMatchObject({
    data: {
      itemID: 2840,
      itemName: 'Copper Bar',
      auctionHouseId: 111
    }
  })
})

test('loader honors auctionHouseId and region query overrides', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        '2589': {
          itemID: 2589,
          itemName: 'Linen Cloth',
          minPrice: 1,
          historicPrice: 1,
          salesPerDay: 1,
          listingData: [],
          currentQuantity: 0,
          avgQuantity: -1,
          currentVsAvgQuantityPercent: 100,
          quantityState: 'stable',
          currentMarketValue: 1,
          historicMarketValue: 1,
          percentChange: 0,
          priceTimeData: [],
          quantityTimeData: [],
          state: 'stable',
          link: 'https://saddlebagexchange.com/wow-forever/item-data/2589',
          auctionHouseId: 113,
          auctionHouseName: 'Horde Auction House',
          faction: 'horde'
        }
      }
    })
  })
  global.fetch = fetchMock as typeof fetch

  await loader({
    request: new Request(
      'https://saddlebagexchange.com/wow-forever/item-data/2589?region=EU&auctionHouseId=113'
    ),
    params: { itemId: '2589' },
    context: {}
  })

  const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body))
  expect(body.auctionHouseId).toBe(113)
  expect(body.region).toBe('EU')
  expect(body.itemIDs).toEqual([2589])
})

test('loader rejects disabled Forever auction house ids', async () => {
  const fetchMock = vi.fn()
  global.fetch = fetchMock as typeof fetch

  const result = await loader({
    request: new Request(
      'https://saddlebagexchange.com/wow-forever/item-data/2840?auctionHouseId=112'
    ),
    params: { itemId: '2840' },
    context: {}
  })

  expect(fetchMock).not.toHaveBeenCalled()
  expect(result).toEqual({
    exception: '112 is not a valid Forever auction house id'
  })
})
