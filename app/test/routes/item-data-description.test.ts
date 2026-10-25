import { beforeEach, describe, expect, it, vi } from 'vitest'
import GetHistory from '~/requests/FFXIV/GetHistory'
import GetListing from '~/requests/FFXIV/GetListing'
import GetBlog from '~/requests/FFXIV/GetBlog'
import { loader } from '~/routes/queries.item-data.$itemId'

vi.mock('~/sessions.server', () => ({
  getUserSessionData: vi.fn(async () => ({ getWorld: () => 'Adamantoise' }))
}))
vi.mock('~/requests/FFXIV/GetHistory', () => ({ default: vi.fn() }))
vi.mock('~/requests/FFXIV/GetListing', () => ({ default: vi.fn() }))
vi.mock('~/requests/FFXIV/GetBlog', () => ({ default: vi.fn() }))

const loadItem = () =>
  loader({
    request: new Request(
      'https://saddlebagexchange.com/queries/item-data/4745'
    ),
    params: { itemId: '4745' },
    context: {}
  })

describe('item pages when optional descriptions are unavailable', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(GetHistory).mockResolvedValue(
      Response.json({ itemID: 4745, price_history: [] })
    )
    vi.mocked(GetListing).mockResolvedValue(
      Response.json({ listings: [], min_price: 100 })
    )
  })

  it.each(['http', 'network', 'invalid-json'])(
    'keeps market data on a %s description failure',
    async (failure) => {
      if (failure === 'network') {
        vi.mocked(GetBlog).mockRejectedValue(
          new Error('Description service down')
        )
      } else {
        vi.mocked(GetBlog).mockResolvedValue(
          failure === 'http'
            ? new Response('Unavailable', { status: 503 })
            : new Response('not json')
        )
      }

      const response = await loadItem()
      expect(response).toBeInstanceOf(Response)
      const data = await (response as Response).json()
      expect(data).not.toHaveProperty('exception')
      expect(data).toMatchObject({
        history: { itemID: 4745 },
        listing: { min_price: 100 },
        itemId: '4745'
      })
      expect(data).not.toHaveProperty('itemDescription')
    }
  )

  it('preserves a valid description', async () => {
    vi.mocked(GetBlog).mockResolvedValue(
      Response.json({ itemDescription: 'Item description' })
    )
    const response = await loadItem()
    expect(await (response as Response).json()).toHaveProperty(
      'itemDescription',
      'Item description'
    )
  })

  it('still reports a failed core market-data request', async () => {
    vi.mocked(GetHistory).mockResolvedValue(
      new Response('Unavailable', { status: 503, statusText: 'Unavailable' })
    )
    vi.mocked(GetBlog).mockResolvedValue(Response.json({}))
    expect(await loadItem()).toEqual({ exception: 'Unavailable' })
  })
})
