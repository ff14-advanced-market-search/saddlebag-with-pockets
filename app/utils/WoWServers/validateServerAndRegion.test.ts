import { it, expect, describe } from 'vitest'
import { validateServerAndRegion } from '.'

const NA_FALLBACK = {
  region: 'NA',
  server: {
    id: 3678,
    name: 'Thrall'
  }
}

const EU_FALLBACK = {
  region: 'EU',
  server: {
    id: 604,
    name: 'Thrall'
  }
}
describe('validateServerAndRegion', () => {
  it('should return default values when nothing is found', () => {
    expect(validateServerAndRegion('NA', undefined, undefined)).toEqual(
      NA_FALLBACK
    )
  })
  it('should return default values when there is no matching server name or id', () => {
    expect(validateServerAndRegion('NA', 3674, undefined)).toEqual(NA_FALLBACK)
    expect(validateServerAndRegion('NA', undefined, 'Antonidas')).toEqual(
      NA_FALLBACK
    )
  })
  it('should return first server in requested region when there is no matching server name or id', () => {
    expect(validateServerAndRegion('EU', 3674, undefined)).toEqual(EU_FALLBACK)
    expect(validateServerAndRegion('EU', undefined, 'Antonidas')).toEqual(
      EU_FALLBACK
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

  it('should normalize invalid regions to NA', () => {
    // This test shows the improved behavior with invalid regions
    const result = validateServerAndRegion('AN' as any, undefined, undefined)
    expect(result.server).toEqual(NA_FALLBACK.server)
    expect(result.region).toBe('NA') // Now properly normalized
  })
})
