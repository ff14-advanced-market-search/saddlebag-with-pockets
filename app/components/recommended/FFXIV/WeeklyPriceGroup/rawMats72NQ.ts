const rawMats72NQ = {
  name: 'FFXIV 7.2 Raw Materials NQ',
  description:
    'Track price changes for non-HQ raw materials from patch 7.2 content.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 1,
    start_day: 1,
    end_year: 2025,
    end_month: 6,
    end_day: 12,
    hq_only: false,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: '7.2 Raw Materials NQ',
        item_ids: [
          36173, 36187, 36167, 36218, 44142, 36179, 44041, 31320, 35792, 44036,
          13723, 13721, 44071, 44150
        ],
        categories: []
      }
    ]
  }
}

export default rawMats72NQ
