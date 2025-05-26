const craftingMaterials = {
  name: 'TWW Crafting Materials',
  description:
    'Track price changes for TWW cloth, leather, and inscription materials.',
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
export default craftingMaterials
