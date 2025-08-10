const rawMats72 = {
  name: 'FFXIV 7.2 Raw Materials',
  description: 'Track price changes for raw materials from patch 7.2 content.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 1,
    start_day: 1,
    end_year: 2025,
    end_month: 6,
    end_day: 12,
    minimum_marketshare: 10000,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: '7.2 Raw Materials NQ',
        item_ids: [
          36173, 36187, 36167, 36218, 44142, 36179, 44041, 31320, 35792, 44036,
          13723, 13721, 44071, 44150
        ],
        categories: [],
        hq_only: false
      },
      {
        name: '7.2 Raw Materials HQ',
        item_ids: [
          36173, 36187, 36167, 36218, 44142, 36179, 44041, 31320, 35792, 44036,
          13723, 13721, 44071, 44150
        ],
        categories: [],
        hq_only: true
      }
    ]
  }
}

export default rawMats72
