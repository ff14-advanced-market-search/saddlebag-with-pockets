import { formatFullScanInput } from '~/requests/FFXIV/FullScan'
import { describe, it, expect } from 'vitest'

describe('formatFullScanInput', () => {
  it('should return defaults when passed nothing or empty object', () => {
    const expected = {
      preferred_roi: 50,
      min_profit_amount: 10000,
      min_desired_avg_ppu: 10000,
      min_stack_size: 1,
      hours_ago: 24,
      min_sales: 5,
      hq: false,
      home_server: 'Midgardsormr',
      filters: [0],
      region_wide: false,
      include_vendor: false,
      show_out_stock: false
    }
    expect(formatFullScanInput()).toEqual(expected)
    expect(formatFullScanInput({})).toEqual(expected)
  })
  it('should map values to corresponding key', () => {
    const expected = {
      preferred_roi: 25,
      min_profit_amount: 30000,
      min_desired_avg_ppu: 20000,
      min_stack_size: 5,
      hours_ago: 12,
      min_sales: 10,
      hq: true,
      home_server: 'Framfrit',
      filters: [0],
      region_wide: false,
      include_vendor: false,
      show_out_stock: true
    }
    expect(
      formatFullScanInput({
        hq_only: true,
        sale_amount: 10,
        world: 'Framfrit',
        minimum_stack_size: 5,
        minimum_profit_amount: 30000,
        price_per_unit: 20000,
        out_of_stock: true,
        roi: 25,
        scan_hours: 12
      })
    ).toEqual(expected)
  })
  it('should keep values for keys that dont need to be mapped', () => {
    const expected = {
      preferred_roi: 25,
      min_profit_amount: 30000,
      min_desired_avg_ppu: 20000,
      min_stack_size: 5,
      hours_ago: 12,
      min_sales: 10,
      hq: true,
      home_server: 'Framfrit',
      filters: [1, 2, 3],
      region_wide: true,
      include_vendor: true,
      show_out_stock: true
    }
    expect(
      formatFullScanInput({
        sale_amount: 10,
        world: 'Framfrit',
        minimum_stack_size: 5,
        hq_only: true,
        minimum_profit_amount: 30000,
        price_per_unit: 20000,
        out_of_stock: true,
        roi: 25,
        scan_hours: 12,
        region_wide: true,
        include_vendor: true,
        filters: [1, 2, 3]
      })
    ).toEqual(expected)
  })
})
