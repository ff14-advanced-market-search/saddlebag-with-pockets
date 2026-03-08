const consumablesTier12_0 = {
  name: 'Midnight Raid 12.0 Consumables',
  description:
    'Comprehensive price tracking for all major Midnight consumables for the first raid. Food, flasks, potions, gems, enchants, etc.',
  config: {
    region: 'NA',
    start_year: 2026,
    start_month: 2,
    start_day: 28,
    end_year: 2026,
    end_month: 6,
    end_day: 1,
    price_groups: [
      {
        name: 'Consumables',
        item_ids: [],
        categories: [
          {
            item_class: 0,
            item_subclass: -1,
            expansion_number: 12,
            min_quality: 0
          }
        ]
      },
      {
        name: 'Enchants and Item Enhancements',
        item_ids: [],
        categories: [
          {
            item_class: 8,
            item_subclass: -1,
            expansion_number: 12,
            min_quality: 0
          }
        ]
      },
      {
        name: 'Cut Gems',
        item_ids: [],
        categories: [
          {
            item_class: 3,
            item_subclass: -1,
            expansion_number: 12,
            min_quality: 0
          }
        ]
      }
    ]
  }
}
export default consumablesTier12_0
