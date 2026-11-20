import { expect, test } from 'vitest'
import {
  getHomeForeverAuctionHouseId,
  isEnabledForeverAuctionHouseId,
  type WoWForeverFaction,
  type WoWForeverRuleset
} from './index'

const homeAuctionHouseCases: Array<{
  ruleset: WoWForeverRuleset
  faction: WoWForeverFaction
  auctionHouseId: number
}> = [
  { ruleset: 'normal', faction: 'alliance', auctionHouseId: 111 },
  { ruleset: 'normal', faction: 'horde', auctionHouseId: 114 },
  { ruleset: 'pvp', faction: 'alliance', auctionHouseId: 110 },
  { ruleset: 'pvp', faction: 'horde', auctionHouseId: 113 },
  { ruleset: 'rp', faction: 'alliance', auctionHouseId: 119 },
  { ruleset: 'rp', faction: 'horde', auctionHouseId: 120 },
  { ruleset: 'rp_pvp', faction: 'alliance', auctionHouseId: 123 },
  { ruleset: 'rp_pvp', faction: 'horde', auctionHouseId: 124 }
]

for (const homeCase of homeAuctionHouseCases) {
  test(`${homeCase.ruleset} ${homeCase.faction} maps to home auction house ${homeCase.auctionHouseId}`, () => {
    expect(
      getHomeForeverAuctionHouseId(homeCase.faction, homeCase.ruleset)
    ).toBe(homeCase.auctionHouseId)
    expect(isEnabledForeverAuctionHouseId(homeCase.auctionHouseId)).toBe(true)
  })
}

test('disabled Forever houses are rejected', () => {
  expect(isEnabledForeverAuctionHouseId(112)).toBe(false)
  expect(isEnabledForeverAuctionHouseId(115)).toBe(false)
  expect(isEnabledForeverAuctionHouseId(118)).toBe(false)
})
