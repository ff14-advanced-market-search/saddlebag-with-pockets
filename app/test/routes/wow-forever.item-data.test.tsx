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

test('loader posts Forever listings with home AH from session defaults', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        itemID: 2840,
        itemName: 'Copper Bar',
        item_type: 'single',
        minPrice: 0.38,
        listingData: [{ price: 0.38, quantity: 20 }],
        currentQuantity: 20,
        currentSoldPerDay: 5,
        currentMarketValue: 1,
        historicMarketValue: 25,
        percentChange: -92.4,
        state: 'crashing',
        link: 'https://saddlebagexchange.com/wow-forever/item-data/2840',
        auctionHouseId: 111,
        auctionHouseName: 'Alliance Auction House',
        faction: 'alliance',
        gameType: 'normal',
        tsmSaleRate: 0.25,
        tsmAvgSalePrice: 5,
        tsmSoldPerDay: 12.5
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
  expect(String(url)).toContain('/api/wow/forever/listings')
  expect(String(url)).not.toContain('bulk-listings')
  expect(init?.method).toBe('POST')
  const body = JSON.parse(String(init?.body))
  expect(body).toEqual({
    discord_consent: WOW_DISCORD_CONSENT,
    auctionHouseId: 111,
    region: 'NA',
    itemID: 2840
  })
  expect(result).toMatchObject({
    data: {
      itemID: 2840,
      itemName: 'Copper Bar',
      auctionHouseId: 111,
      gameType: 'normal',
      currentSoldPerDay: 5,
      tsmSaleRate: 0.25,
      tsmAvgSalePrice: 5,
      tsmSoldPerDay: 12.5
    }
  })
  expect(result).toBeTruthy()
  if (result && typeof result === 'object' && 'data' in result) {
    expect(result.data).not.toHaveProperty('historicPrice')
    expect(result.data).not.toHaveProperty('salesPerDay')
  }
})

test('loader honors auctionHouseId and region query overrides', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        itemID: 2589,
        itemName: 'Linen Cloth',
        minPrice: 1,
        listingData: [],
        currentQuantity: 0,
        currentSoldPerDay: 0,
        currentMarketValue: 0,
        historicMarketValue: 0,
        percentChange: 0,
        state: 'stable',
        link: 'https://saddlebagexchange.com/wow-forever/item-data/2589',
        auctionHouseId: 113,
        auctionHouseName: 'Horde Auction House',
        faction: 'horde',
        gameType: 'pvp',
        tsmSaleRate: null
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
  expect(body.itemID).toBe(2589)
  expect(body.itemIDs).toBeUndefined()
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

test('loader returns invalid-response exception for empty data payload', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: {} })
  }) as typeof fetch

  const result = await loader({
    request: new Request(
      'https://saddlebagexchange.com/wow-forever/item-data/2840'
    ),
    params: { itemId: '2840' },
    context: {}
  })

  expect(result).toEqual({ exception: 'Invalid Forever listings response' })
})

test('loader rejects listingData rows without numeric price and quantity', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        itemID: 2840,
        itemName: 'Copper Bar',
        minPrice: 1,
        listingData: [null],
        currentQuantity: 0,
        currentSoldPerDay: 0,
        currentMarketValue: 0,
        historicMarketValue: 0,
        percentChange: 0,
        state: 'stable',
        link: 'https://saddlebagexchange.com/wow-forever/item-data/2840',
        auctionHouseId: 111,
        auctionHouseName: 'Alliance Auction House',
        faction: 'alliance',
        gameType: 'normal'
      }
    })
  }) as typeof fetch

  const result = await loader({
    request: new Request(
      'https://saddlebagexchange.com/wow-forever/item-data/2840'
    ),
    params: { itemId: '2840' },
    context: {}
  })

  expect(result).toEqual({ exception: 'Invalid Forever listings response' })
})
