import { loader } from '~/routes/queries.full-scan'
import { describe, it, expect } from 'vitest'

describe('queries/full-scan', () => {
  describe('loader', () => {
    it('returns empty input defaults when not given any', async () => {
      const params = {}
      const context = {}
      const request = new Request('https://saddlebag.com')
      const result = await loader({ request, context, params })
      const data = await result.json()
      expect(data).toEqual({})
    })
    it('returns correct fields when passed in search params', async () => {
      const params = {}
      const context = {}
      const request = new Request(
        'https://saddlebag.com?hours=168&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=30000&filters=56,65,66,67,68,69,70,71,72,81,82&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true'
      )
      const result = await loader({ request, context, params })
      const data = await result.json()
      expect(data).toEqual({
        ROI: 25,
        filters: [56, 65, 66, 67, 68, 69, 70, 71, 72, 81, 82],
        hQChecked: false,
        hours: 168,
        includeVendorChecked: true,
        minimumProfitAmount: 75000,
        minimumStackSize: 1,
        outOfStockChecked: true,
        pricePerUnit: 30000,
        regionWideChecked: true,
        salesAmount: 2
      })
    })
    it('returns only valid fields when passed in search params that are incorrect', async () => {
      const params = {}
      const context = {}
      const request = new Request(
        'https://saddlebag.com?invalidparam=notvalid&hours=168&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=30000&filters=56,65,66,67,68,69,70,71,72,81,82&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true'
      )
      const result = await loader({ request, context, params })
      const data = await result.json()
      expect(data).toEqual({
        ROI: 25,
        filters: [56, 65, 66, 67, 68, 69, 70, 71, 72, 81, 82],
        hQChecked: false,
        hours: 168,
        includeVendorChecked: true,
        minimumProfitAmount: 75000,
        minimumStackSize: 1,
        outOfStockChecked: true,
        pricePerUnit: 30000,
        regionWideChecked: true,
        salesAmount: 2
      })
      expect(data).not.toHaveProperty('invalidparam')
    })
  })
})
