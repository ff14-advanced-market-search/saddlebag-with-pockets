const raidConsumables = {
  name: 'TWW Raid Consumables',
  description: 'Monitor price changes for TWW raid consumables.',
  config: {
    region: 'NA',
    start_year: 2025,
    start_month: 1,
    start_day: 1,
    end_year: 2025,
    end_month: 6,
    end_day: 25,
    price_groups: [
      {
        name: 'raid consumables',
        item_ids: [
          211880, 212241, 212244, 212247, 212250, 212253, 212256, 212259,
          212262, 212265, 212268, 212271, 212274, 212277, 212280, 212283,
          212301, 212307, 212310, 212313, 212316, 221874, 221878, 221882,
          221955, 222504, 222507, 222510, 222599, 222602, 222605, 222608,
          224107, 224110, 224113, 226036, 232534, 232937
        ],
        categories: []
      }
    ]
  }
}
export default raidConsumables
