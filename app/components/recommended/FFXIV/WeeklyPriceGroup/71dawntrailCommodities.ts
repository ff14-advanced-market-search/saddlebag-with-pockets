const dawntrail71Commodities = {
  name: 'Dawntrail 7.1 Commodities',
  description:
    'Monitor price trends for Dawntrail 7.1 commodities across all categories.',
  config: {
    region: 'NA',
    start_year: 2024,
    start_month: 10,
    start_day: 1,
    end_year: 2025,
    end_month: 2,
    end_day: 1,
    minimum_marketshare: 30000000,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      { name: 'Medicine NQ', item_ids: [], categories: [43], hq_only: false },
      { name: 'Medicine HQ', item_ids: [], categories: [43], hq_only: true },

      {
        name: 'Ingredients NQ',
        item_ids: [],
        categories: [44],
        hq_only: false
      },
      { name: 'Ingredients HQ', item_ids: [], categories: [44], hq_only: true },

      { name: 'Meals NQ', item_ids: [], categories: [45], hq_only: false },
      { name: 'Meals HQ', item_ids: [], categories: [45], hq_only: true },

      { name: 'Seafood NQ', item_ids: [], categories: [46], hq_only: false },
      { name: 'Seafood HQ', item_ids: [], categories: [46], hq_only: true },

      { name: 'Stone NQ', item_ids: [], categories: [47], hq_only: false },
      { name: 'Stone HQ', item_ids: [], categories: [47], hq_only: true },

      { name: 'Metal NQ', item_ids: [], categories: [48], hq_only: false },
      { name: 'Metal HQ', item_ids: [], categories: [48], hq_only: true },

      { name: 'Lumber NQ', item_ids: [], categories: [49], hq_only: false },
      { name: 'Lumber HQ', item_ids: [], categories: [49], hq_only: true },

      { name: 'Cloth NQ', item_ids: [], categories: [50], hq_only: false },
      { name: 'Cloth HQ', item_ids: [], categories: [50], hq_only: true },

      { name: 'Leather NQ', item_ids: [], categories: [51], hq_only: false },
      { name: 'Leather HQ', item_ids: [], categories: [51], hq_only: true },

      { name: 'Bone NQ', item_ids: [], categories: [52], hq_only: false },

      { name: 'Reagents NQ', item_ids: [], categories: [53], hq_only: false },
      { name: 'Reagents HQ', item_ids: [], categories: [53], hq_only: true },

      { name: 'Dyes NQ', item_ids: [], categories: [54], hq_only: false },
      { name: 'Dyes HQ', item_ids: [], categories: [54], hq_only: true },

      {
        name: 'Weapon Parts NQ',
        item_ids: [],
        categories: [55],
        hq_only: false
      },
      {
        name: 'Weapon Parts HQ',
        item_ids: [],
        categories: [55],
        hq_only: true
      },

      {
        name: 'Furnishings NQ',
        item_ids: [],
        categories: [56],
        hq_only: false
      },

      { name: 'Materia NQ', item_ids: [], categories: [57], hq_only: false },

      { name: 'Crystals NQ', item_ids: [], categories: [58], hq_only: false },
      { name: 'Crystals HQ', item_ids: [], categories: [58], hq_only: true },

      { name: 'Catalysts NQ', item_ids: [], categories: [59], hq_only: false },
      { name: 'Catalysts HQ', item_ids: [], categories: [59], hq_only: true },

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

export default dawntrail71Commodities
