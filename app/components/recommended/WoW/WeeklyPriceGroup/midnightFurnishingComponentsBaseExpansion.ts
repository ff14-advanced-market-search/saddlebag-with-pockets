const midnightFurnishingComponents = {
  name: 'WoW Midnight Expanse Furnishing Base Materials by Expansion',
  description:
    'By Expansion: Monitor price changes for base materials for crafted recipes used to make reagents of furnishing recipes for the Midnight Expanse. Taken from WOWDB.',
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
          191460, 191461, 191462, 191464, 191465, 191466, 191467, 191468,
          191469, 191470, 191471, 191472, 192880, 193368, 193369, 193370,
          194967, 197741, 197744, 197746, 197747, 197754, 197755, 198412,
          198413, 198414, 198415, 198416, 198417, 198418, 198419, 198420,
          198421, 198422, 198423
        ],
        categories: []
      },
      {
        name: 'The War Within',
        item_ids: [
          210796, 210797, 210798, 210799, 210800, 210801, 210802, 210803,
          210804, 210805, 210806, 210807, 210808, 210809, 210810, 210930,
          210931, 210932, 210933, 210934, 210935, 210936, 210937, 210938,
          212495, 212505, 212511, 212674, 212675, 212676, 213611, 213612,
          217707, 218337, 219946, 219947, 219948, 222612, 222613, 222614,
          222618, 222619, 222620, 222739, 222741, 222795, 222796, 222797,
          223977, 224800, 224801, 224802, 224803, 224804, 224805
        ],
        categories: []
      }
    ]
  }
}
export default midnightFurnishingComponents
