const midnightFurnishingDyes = {
  name: 'WoW Midnight Expanse Furnishing Dyes by Color',
  description:
    'Monitor price changes for dye materials used in housing item dyes crafted by Alchemists and Inscriptionists. Used for dying all furnishings.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 7,
    start_day: 1,
    end_year: 2026,
    end_month: 12,
    end_day: 30,
    price_groups: [
      {
        name: 'Orange',
        item_ids: [
          13464, 22792, 36901, 52986, 72237, 109125, 124103, 152509, 168583,
          191472, 210801
        ],
        categories: []
      },
      {
        name: 'White',
        item_ids: [
          2447, 22787, 36906, 52988, 79010, 109129, 124104, 152508, 168586,
          191466, 210798
        ],
        categories: []
      },
      {
        name: 'Black',
        item_ids: [
          3818, 22785, 36905, 52985, 89639, 109128, 128304, 152505, 169701,
          191472, 210807
        ],
        categories: []
      },
      {
        name: 'Blue',
        item_ids: [
          765, 22789, 36906, 52984, 72235, 109124, 124102, 152507, 169701,
          191469, 210801
        ],
        categories: []
      },
      {
        name: 'Brown',
        item_ids: [
          2450, 22786, 36903, 52983, 89639, 109126, 124103, 152511, 168589,
          191472, 210798
        ],
        categories: []
      },
      {
        name: 'Green',
        item_ids: [
          2452, 22785, 36903, 52985, 72234, 109128, 124102, 152505, 170554,
          191469, 210807
        ],
        categories: []
      },
      {
        name: 'Purple',
        item_ids: [
          3356, 22793, 36907, 52987, 79011, 109129, 124101, 168487, 170554,
          191462, 210804
        ],
        categories: []
      },
      {
        name: 'Red',
        item_ids: [
          785, 22791, 36904, 52983, 72237, 109125, 151565, 152506, 168583,
          191466, 210810
        ],
        categories: []
      },
      {
        name: 'Teal',
        item_ids: [
          2453, 22789, 36905, 52984, 72235, 109127, 128304, 152509, 168589,
          191462, 210804
        ],
        categories: []
      },
      {
        name: 'Yellow',
        item_ids: [
          8838, 22786, 36901, 52988, 72234, 109126, 124104, 152511, 168586,
          191466, 210810
        ],
        categories: []
      }
    ]
  }
}
export default midnightFurnishingDyes
