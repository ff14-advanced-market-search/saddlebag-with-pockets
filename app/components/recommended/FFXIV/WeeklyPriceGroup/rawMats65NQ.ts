const rawMats65NQ = {
  name: 'FFXIV 6.5 Raw Materials NQ',
  description:
    'Track price changes for non-HQ raw materials from patch 6.5 content.',
  config: {
    region: 'NA',
    start_year: 2024,
    start_month: 1,
    start_day: 1,
    end_year: 2024,
    end_month: 6,
    end_day: 1,
    hq_only: false,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: '6.5 Raw Materials NQ',
        item_ids: [5104, 5105],
        categories: []
      }
    ]
  }
}

export default rawMats65NQ
