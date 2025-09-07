const furnishings = {
  name: 'FFXIV Furnishings',
  description: 'Track price changes for furniture and housing items in FFXIV.',
  config: {
    region: 'NA',
    start_year: 2022,
    start_month: 1,
    start_day: 1,
    end_year: 2029,
    end_month: 1,
    end_day: 1,
    minimum_marketshare: 30000000,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: 'Furnishings',
        item_ids: [],
        categories: [56],
        hq_only: false
      },

      {
        name: 'Exterior Fixtures',
        item_ids: [],
        categories: [65],
        hq_only: false
      },

      {
        name: 'Interior Fixtures',
        item_ids: [],
        categories: [66],
        hq_only: false
      },

      {
        name: 'Outdoor Furnishings',
        item_ids: [],
        categories: [67],
        hq_only: false
      },

      {
        name: 'Chairs and Beds',
        item_ids: [],
        categories: [68],
        hq_only: false
      },

      { name: 'Tables', item_ids: [], categories: [69], hq_only: false },

      { name: 'Tabletop', item_ids: [], categories: [70], hq_only: false },

      {
        name: 'Wall-mounted',
        item_ids: [],
        categories: [71],
        hq_only: false
      },

      { name: 'Rugs', item_ids: [], categories: [72], hq_only: false },

      {
        name: 'Gardening Items',
        item_ids: [],
        categories: [81],
        hq_only: false
      },

      { name: 'Paintings', item_ids: [], categories: [82], hq_only: false }
    ]
  }
}

export default furnishings
