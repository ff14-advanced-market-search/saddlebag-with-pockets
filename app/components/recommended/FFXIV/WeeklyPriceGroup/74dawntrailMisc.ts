const dawntrail73Misc = {
  name: 'Dawntrail 7.3 Furniture, Collectables, Cosmetics, and Miscellaneous items',
  description:
    'Monitor price trends for Dawntrail 7.3 furnishings, cosmetics, and miscellaneous categories.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 11,
    start_day: 1,
    end_year: 2026,
    end_month: 3,
    end_day: 1,
    minimum_marketshare: 30000000,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: 'Furnishings NQ',
        item_ids: [],
        categories: [56],
        hq_only: false
      },

      { name: 'Miscellany NQ', item_ids: [], categories: [60], hq_only: false },
      { name: 'Miscellany HQ', item_ids: [], categories: [60], hq_only: true },

      {
        name: 'Exterior Fixtures NQ',
        item_ids: [],
        categories: [65],
        hq_only: false
      },

      {
        name: 'Interior Fixtures NQ',
        item_ids: [],
        categories: [66],
        hq_only: false
      },

      {
        name: 'Outdoor Furnishings NQ',
        item_ids: [],
        categories: [67],
        hq_only: false
      },

      {
        name: 'Chairs and Beds NQ',
        item_ids: [],
        categories: [68],
        hq_only: false
      },

      { name: 'Tables NQ', item_ids: [], categories: [69], hq_only: false },

      { name: 'Tabletop NQ', item_ids: [], categories: [70], hq_only: false },

      {
        name: 'Wall-mounted NQ',
        item_ids: [],
        categories: [71],
        hq_only: false
      },

      { name: 'Rugs NQ', item_ids: [], categories: [72], hq_only: false },

      {
        name: 'Seasonal Miscellany NQ',
        item_ids: [],
        categories: [74],
        hq_only: false
      },

      { name: 'Minions NQ', item_ids: [], categories: [75], hq_only: false },

      {
        name: 'Airship Submersible Components NQ',
        item_ids: [],
        categories: [79],
        hq_only: false
      },

      {
        name: 'Orchestrion Components NQ',
        item_ids: [],
        categories: [80],
        hq_only: false
      },

      {
        name: 'Gardening Items NQ',
        item_ids: [],
        categories: [81],
        hq_only: false
      },

      { name: 'Paintings NQ', item_ids: [], categories: [82], hq_only: false },

      {
        name: 'Registrable Miscellany NQ',
        item_ids: [],
        categories: [90],
        hq_only: false
      }
    ]
  }
}

export default dawntrail73Misc
