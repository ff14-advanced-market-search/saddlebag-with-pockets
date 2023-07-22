import { it, expect, describe } from 'vitest'
import { validateServerAndRegion } from '.'

const FALLBACK = {
  region: 'NA',
  server: {
    id: 3678,
    name: 'Thrall'
  }
}
describe('validateServerAndRegion', () => {
  it('should return default values when nothing is found', () => {
    expect(validateServerAndRegion('NA', undefined, undefined)).toEqual(
      FALLBACK
    )
  })
  it('should return default values when there is no matching server name or id', () => {
    expect(validateServerAndRegion('NA', 3674, undefined)).toEqual(FALLBACK)
    expect(validateServerAndRegion('NA', undefined, 'Antonidas')).toEqual(
      FALLBACK
    )
  })
  it('should reset the region to NA when there is no matching server name or id', () => {
    expect(validateServerAndRegion('EU', 3674, undefined)).toEqual(FALLBACK)
    expect(validateServerAndRegion('EU', undefined, 'Antonidas')).toEqual(
      FALLBACK
    )
  })
  it('should return a server if it exists', () => {
    const expected = {
      region: 'EU',
      server: {
        id: 633,
        name: 'Executus'
      }
    }
    expect(validateServerAndRegion('EU', 633, 'Executus')).toEqual(expected)
  })
})
