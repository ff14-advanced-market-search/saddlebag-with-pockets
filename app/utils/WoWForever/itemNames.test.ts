import { describe, expect, it } from 'vitest'
import {
  foreverItemNamesToEntries,
  foreverItemNamesToSelectOptions,
  isSearchGame
} from './itemNames'

describe('foreverItemNames helpers', () => {
  it('sorts entries by name and maps select options', () => {
    const names = {
      '2840': 'Copper Bar',
      '2589': 'Linen Cloth'
    }

    expect(foreverItemNamesToEntries(names)).toEqual([
      ['2840', 'Copper Bar'],
      ['2589', 'Linen Cloth']
    ])
    expect(foreverItemNamesToSelectOptions(names)).toEqual([
      { value: '2840', label: 'Copper Bar' },
      { value: '2589', label: 'Linen Cloth' }
    ])
  })

  it('recognizes search games including forever', () => {
    expect(isSearchGame('forever')).toBe(true)
    expect(isSearchGame('wow')).toBe(true)
    expect(isSearchGame('retail')).toBe(false)
  })
})
