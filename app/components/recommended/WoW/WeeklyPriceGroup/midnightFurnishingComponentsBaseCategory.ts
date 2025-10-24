const midnightFurnishingComponents = {
  name: 'WoW Midnight Expanse Furnishing Base Materials by Category',
  description:
    'Monitor price changes for base materials for materials for crafted recipes used to make regents of furnishing recipies for the Midnight Expanse. Taken from WOWDB.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 7,
    start_day: 1,
    end_year: 2026,
    end_month: 12,
    end_day: 1,
    price_groups: [
      {
        name: 'TG-Metal-Stone',
        item_ids: [
          11370, 97512, 108298, 108299, 108300, 108302, 108304, 108305, 108307,
          108308, 108391, 109991, 109992, 171840, 210930, 210933, 210936, 217707
        ],
        categories: []
      },
      {
        name: 'TG-Enchanting',
        item_ids: [74252, 109693, 219946],
        categories: []
      },
      {
        name: 'TG-Elemental',
        item_ids: [89112],
        categories: []
      },
      {
        name: 'TG-Herb',
        item_ids: [
          97619, 97620, 108352, 108355, 108360, 108362, 108363, 108365, 109624,
          109625, 109626, 109627, 109628, 109629, 124101, 124102, 124103,
          169697, 169698, 169700, 191460, 191464, 191467, 191470, 210796,
          210799, 210802, 210805, 210808
        ],
        categories: []
      },
      {
        name: 'TG-Leather',
        item_ids: [
          2934, 8169, 8171, 25649, 33567, 52977, 72162, 112156, 112179, 112184,
          172093, 212674, 218337
        ],
        categories: []
      },
      {
        name: 'TG-Cloth',
        item_ids: [14047, 14227, 21877, 33470, 53010, 124437, 152577, 222795],
        categories: []
      },
      {
        name: 'TG-Jewelcrafting-and-Gems',
        item_ids: [
          12363, 21929, 23077, 23117, 24243, 36917, 36923, 36924, 36929, 36930,
          36932, 52177, 52181, 173108, 192880, 193368, 212495, 212505, 212511
        ],
        categories: []
      },
      {
        name: 'TG-Inscription',
        item_ids: [
          39342, 43105, 43106, 43107, 173056, 173057, 175788, 198412, 198415,
          198418, 198421, 222612, 222618, 224802, 224805
        ],
        categories: []
      },
      {
        name: 'TG-Other',
        item_ids: [83064, 213611, 213612],
        categories: []
      },
      {
        name: 'TG-Cooking',
        item_ids: [
          53065, 109136, 109143, 152546, 173032, 173033, 194967, 197741, 197744,
          197746, 197747, 197754, 197755, 222739, 222741, 223977
        ],
        categories: []
      }
    ]
  }
}
export default midnightFurnishingComponents
