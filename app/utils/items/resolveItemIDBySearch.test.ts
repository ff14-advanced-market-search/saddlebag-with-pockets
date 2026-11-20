import { describe, expect, it } from 'vitest'
import { itemSelectOptionsWithUniqueLabels } from './id_to_item'
import { resolveItemIDBySearch } from './index'

const foreverSample: [string, string][] = [
  ['5369', 'Gnawed Bone'],
  ['282654', 'Gnawed Bone'],
  ['2840', 'Copper Bar']
]

describe('resolveItemIDBySearch', () => {
  it('resolves unique names and disambiguated duplicate suggestions', () => {
    expect(resolveItemIDBySearch('Copper Bar', foreverSample)).toBe('2840')
    expect(resolveItemIDBySearch('Gnawed Bone', foreverSample)).toBe('5369')
    expect(resolveItemIDBySearch('Gnawed Bone (282654)', foreverSample)).toBe(
      '282654'
    )
    expect(resolveItemIDBySearch('Gnawed Bone (5369)', foreverSample)).toBe(
      '5369'
    )
  })
})

describe('itemSelectOptionsWithUniqueLabels', () => {
  it('appends ids only for duplicate names', () => {
    expect(itemSelectOptionsWithUniqueLabels(foreverSample)).toEqual([
      { value: '5369', label: 'Gnawed Bone (5369)' },
      { value: '282654', label: 'Gnawed Bone (282654)' },
      { value: '2840', label: 'Copper Bar' }
    ])
  })
})
