import { expect, test } from 'vitest'
import {
  getHomeForeverAuctionHouseId,
  isEnabledForeverAuctionHouseId
} from './index'

test.each([
  ['normal', 'alliance', 111],
  ['normal', 'horde', 114],
  ['pvp', 'alliance', 110],
  ['pvp', 'horde', 113],
  ['rp', 'alliance', 119],
  ['rp', 'horde', 120],
  ['rp_pvp', 'alliance', 123],
  ['rp_pvp', 'horde', 124]
] as const)(
  '%s %s maps to home auction house %i',
  (ruleset, faction, auctionHouseId) => {
    expect(getHomeForeverAuctionHouseId(faction, ruleset)).toBe(auctionHouseId)
    expect(isEnabledForeverAuctionHouseId(auctionHouseId)).toBe(true)
  }
)

test('disabled Forever houses are rejected', () => {
  expect(isEnabledForeverAuctionHouseId(112)).toBe(false)
  expect(isEnabledForeverAuctionHouseId(115)).toBe(false)
  expect(isEnabledForeverAuctionHouseId(118)).toBe(false)
})
