/**
 * Split a WoW gold amount into gold / silver / copper for AAA-style display.
 *
 * Input is gold (API values keep up to 4 decimal places = copper precision:
 * 1g = 100s = 10000c). Copper may retain fractional decimals from the API.
 */
export interface WowCoinParts {
  gold: number
  silver: number
  copper: number
}

export const goldToCoins = (goldAmount: number): WowCoinParts => {
  if (!Number.isFinite(goldAmount)) {
    return { gold: 0, silver: 0, copper: 0 }
  }

  const sign = goldAmount < 0 ? -1 : 1
  const totalCopper = Number((Math.abs(goldAmount) * 10000).toFixed(4))
  const gold = Math.trunc(totalCopper / 10000)
  const afterGold = totalCopper - gold * 10000
  const silver = Math.trunc(afterGold / 100)
  const copper = Number((afterGold - silver * 100).toFixed(4))

  return {
    gold: gold * sign,
    silver: silver * sign,
    copper: copper * sign
  }
}

/** Format copper for display: trim trailing zeros, keep up to 4 decimals. */
export const formatCopperAmount = (copper: number): string => {
  const abs = Math.abs(copper)
  if (Number.isInteger(abs)) {
    return Math.trunc(abs).toLocaleString()
  }
  return abs.toLocaleString(undefined, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  })
}

/** Plain-text AAA-style string, e.g. `12g 34s 56c`. */
export const formatGoldText = (goldAmount: number): string => {
  const { gold, silver, copper } = goldToCoins(goldAmount)
  const sign = goldAmount < 0 ? '-' : ''
  return `${sign}${Math.abs(gold).toLocaleString()}g ${Math.abs(
    silver
  )}s ${formatCopperAmount(copper)}c`
}
