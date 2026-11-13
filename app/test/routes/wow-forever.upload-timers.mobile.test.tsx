import { renderToString } from 'react-dom/server'
import { expect, test, vi } from 'vitest'
import type { ForeverUploadTimer } from '~/requests/WoWForever/UploadTimers'

const rows: Array<ForeverUploadTimer> = [
  {
    region: 'NA',
    auctionHouseID: 114,
    feedType: 'commodity',
    lastUploadTimeRaw: 'Fri, 13 Nov 2026 01:25:21 GMT',
    lastUploadUnix: 1_000,
    lastCheckedUnix: 1,
    lastPublishedUnix: 1,
    lastHttpStatus: 200,
    auctionCount: 105031
  },
  {
    region: 'EU',
    auctionHouseID: 111,
    feedType: 'single',
    lastUploadTimeRaw: 'Fri, 13 Nov 2026 01:25:22 GMT',
    lastUploadUnix: 2_000,
    lastCheckedUnix: 1,
    lastPublishedUnix: 1,
    lastHttpStatus: 200,
    auctionCount: 146898
  }
]

vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react')
  return {
    ...(actual as Record<string, unknown>),
    useLoaderData: () => ({ data: rows })
  }
})

test('mobile upload timers default to region, feed, auctions, and last upload', async () => {
  const { default: UploadTimers } = await import(
    '~/routes/wow-forever.upload-timers'
  )
  const html = renderToString(<UploadTimers />)
  const mobile = html.split('hidden mt-0 sm:flex')[0]

  expect(mobile).toContain('Table sort by')
  expect(mobile).toContain('value="lastUploadUnix" selected=""')
  expect(mobile).toContain('>Last Upload<')

  const headerNames = [...mobile.matchAll(/<th[\s\S]*?<\/th>/g)].map((match) =>
    match[0]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  )
  expect(headerNames.slice(0, 4)).toEqual([
    'Region',
    'Feed',
    'Auctions',
    'Last Upload'
  ])

  const newer = mobile.indexOf('Fri, 13 Nov 2026 01:25:22 GMT')
  const older = mobile.indexOf('Fri, 13 Nov 2026 01:25:21 GMT')
  expect(newer).toBeGreaterThan(-1)
  expect(older).toBeGreaterThan(newer)
  expect(mobile).toContain('Items')
  expect(mobile).toContain('Commodities')
  expect(mobile).toContain('146,898')

  const headerRow = mobile.match(/<thead[\s\S]*?<\/thead>/)?.[0] ?? ''
  expect(headerRow).not.toContain('Auction House')
})
