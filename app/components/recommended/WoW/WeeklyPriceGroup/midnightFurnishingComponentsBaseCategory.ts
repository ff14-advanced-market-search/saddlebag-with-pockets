const midnightFurnishingComponents = {
  name: 'WoW Midnight Expanse Furnishing Components by Expansion',
  description:
    'Monitor price changes for materials from all expansions that may be used in furnishing for the Midnight Expanse. Taken from WOWDB.',
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
        name: 'Vanilla',
        item_ids: [2934, 8169, 8171, 11370, 12363, 14047, 14227],
        categories: []
      },
      {
        name: 'TBC',
        item_ids: [21877, 21929, 23077, 23117, 24243, 25649],
        categories: []
      },
      {
        name: 'WotLK',
        item_ids: [
          33470, 33567, 36917, 36923, 36924, 36929, 36930, 36932, 39342, 43105,
          43106, 43107
        ],
        categories: []
      },
      {
        name: 'Cataclysm',
        item_ids: [52177, 52181, 52977, 53010, 53065],
        categories: []
      },
      {
        name: 'MoP',
        item_ids: [72162, 74252, 83064, 89112, 97512, 97619, 97620],
        categories: []
      },
      {
        name: 'BFA',
        item_ids: [152546, 152577, 169697, 169698, 169700],
        categories: []
      },
      {
        name: 'Shadowlands',
        item_ids: [
          171840, 172093, 173032, 173033, 173056, 173057, 173108, 175788
        ],
        categories: []
      },
      {
        name: 'Legion',
        item_ids: [124101, 124102, 124103, 124437],
        categories: []
      },
      {
        name: 'Warlords of Draenor',
        item_ids: [
          108298, 108299, 108300, 108302, 108304, 108305, 108307, 108308,
          108352, 108355, 108360, 108362, 108363, 108365, 108391, 109136,
          109143, 109624, 109625, 109626, 109627, 109628, 109629, 109693,
          109991, 109992, 112156, 112179, 112184
        ],
        categories: []
      },
      {
        name: 'Dragonflight',
        item_ids: [
          191460, 191464, 191467, 191470, 192880, 193368, 194967, 197741,
          197744, 197746, 197747, 197754, 197755, 198412, 198415, 198418, 198421
        ],
        categories: []
      },
      {
        name: 'The War Within',
        item_ids: [
          210796, 210799, 210802, 210805, 210808, 210930, 210933, 210936,
          212495, 212505, 212511, 212674, 213611, 213612, 217707, 218337,
          219946, 222612, 222618, 222739, 222741, 222795, 223977, 224802, 224805
        ],
        categories: []
      }
    ]
  }
}
export default midnightFurnishingComponents
