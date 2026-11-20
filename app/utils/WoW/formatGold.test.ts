import { describe, expect, it } from 'vitest'
import { formatCopperAmount, formatGoldText, goldToCoins } from './formatGold'

describe('goldToCoins', () => {
  it('splits gold into g/s/c', () => {
    expect(goldToCoins(12.3456)).toEqual({
      gold: 12,
      silver: 34,
      copper: 56
    })
    expect(goldToCoins(0.01)).toEqual({ gold: 0, silver: 1, copper: 0 })
    expect(goldToCoins(0.0001)).toEqual({ gold: 0, silver: 0, copper: 1 })
  })

  it('keeps fractional copper from 4-decimal gold precision', () => {
    expect(goldToCoins(1.00001234).copper).toBeCloseTo(0.1234, 4)
  })

  it('formats AAA-style text', () => {
    expect(formatGoldText(12.3456)).toBe('12g 34s 56c')
    expect(formatCopperAmount(12.34)).toBe('12.34')
  })
})
