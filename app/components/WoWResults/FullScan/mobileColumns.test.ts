import { expect, test } from 'vitest'
import { nextMobileColumns } from './MobileTable'

const columns = [
  { columnId: 'region', header: 'Region' },
  { columnId: 'feedLabel', header: 'Feed' },
  { columnId: 'auctionCount', header: 'Auctions' },
  { columnId: 'lastUploadUnix', header: 'Last Upload' }
]

test('selecting a visible auctions column keeps the current headers', () => {
  expect(
    nextMobileColumns(columns, 'lastUploadUnix', 'auctionCount', columns).map(
      (column) => column.header
    )
  ).toEqual(['Region', 'Feed', 'Auctions', 'Last Upload'])
})

test('selecting a hidden column replaces the previous sort column', () => {
  const labels = [
    ...columns,
    { columnId: 'auctionHouseID', header: 'Auction House ID' }
  ]

  expect(
    nextMobileColumns(columns, 'lastUploadUnix', 'auctionHouseID', labels).map(
      (column) => column.header
    )
  ).toEqual(['Region', 'Feed', 'Auctions', 'Auction House ID'])
})
