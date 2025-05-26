const gems = {
  name: 'TWW Gems & Materials',
  description: 'Track price changes for TWW gems and jewelcrafting materials.',
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
      }
    ]
  }
}
export default gems
