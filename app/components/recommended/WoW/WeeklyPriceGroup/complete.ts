const complete = {
  name: 'TWW Complete Analysis',
  description:
    'Comprehensive price tracking for all TWW crafting and consumable items.',
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
        name: 'enchants',
        item_ids: [],
        categories: [
          {
            item_class: 8,
            item_subclass: -1,
            expansion_number: 11,
            min_quality: 3
          },
          {
            item_class: 7,
            item_subclass: 12,
            expansion_number: 11,
            min_quality: 2
          }
        ]
      },
      {
        name: 'alch',
        item_ids: [],
        categories: [
          {
            item_class: 0,
            item_subclass: 1,
            expansion_number: 11,
            min_quality: 3
          },
          {
            item_class: 0,
            item_subclass: 2,
            expansion_number: 11,
            min_quality: 3
          },
          {
            item_class: 0,
            item_subclass: 3,
            expansion_number: 11,
            min_quality: 3
          },
          {
            item_class: 7,
            item_subclass: 8,
            expansion_number: 11,
            min_quality: 2
          }
        ]
      },
      {
        name: 'gems',
        item_ids: [],
        categories: [
          {
            item_class: 3,
            item_subclass: -1,
            expansion_number: 11,
            min_quality: 3
          },
          {
            item_class: 7,
            item_subclass: 4,
            expansion_number: 11,
            min_quality: 2
          }
        ]
      },
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
      },
      {
        name: 'cloth and leather',
        item_ids: [],
        categories: [
          {
            item_class: 7,
            item_subclass: 5,
            expansion_number: 11,
            min_quality: 2
          },
          {
            item_class: 7,
            item_subclass: 6,
            expansion_number: 11,
            min_quality: 2
          }
        ]
      },
      {
        name: 'inscription',
        item_ids: [],
        categories: [
          {
            item_class: 7,
            item_subclass: 16,
            expansion_number: 11,
            min_quality: 2
          },
          {
            item_class: 7,
            item_subclass: 16,
            expansion_number: 11,
            min_quality: 3
          }
        ]
      }
    ]
  }
}
export default complete
