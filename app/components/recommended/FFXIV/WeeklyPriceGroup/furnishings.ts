const furnishings = {
  name: 'FFXIV Furnishings',
  description: 'Track price changes for furniture and housing items in FFXIV.',
  config: {
    region: 'NA',
    start_year: 2022,
    start_month: 1,
    start_day: 1,
    end_year: 2026,
    end_month: 5,
    end_day: 2,
    minimum_marketshare: 10000,
    price_setting: 'median',
    quantity_setting: 'quantitySold',
    price_groups: [
      {
        name: 'Furnishings',
        item_ids: [
          44120, 23892, 20734, 38608, 24514, 30385, 37360, 35559, 12108, 16781,
          37369, 39409, 20310, 35571, 24511, 28639, 8831, 20735, 37359, 29682,
          35561, 40630, 32226, 15974, 28975, 40620, 33283, 24512, 32221, 7979,
          7970, 30410, 21839, 32254, 7064, 29680, 27296, 22552, 6637
        ],
        categories: [],
        hq_only: false
      }
    ]
  }
}

export default furnishings
