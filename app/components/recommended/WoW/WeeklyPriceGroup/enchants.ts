const enchants = {
  name: 'TWW Enchants & Materials',
  description: 'Track price changes for TWW enchants and enchanting materials.',
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
      }
    ]
  }
}
export default enchants
